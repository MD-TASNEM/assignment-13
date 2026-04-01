import express from "express";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { verifyToken, isBuyer } from "../middleware/authUtils.js";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent (for Stripe checkout)
router.post("/create-intent", verifyToken, isBuyer, async (req, res) => {
  try {
    const { coins, amount } = req.body;

    if (!coins || !amount) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        userId: req.userId.toString(),
        coins: coins.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to create payment intent",
        error: error.message,
      });
  }
});

// Confirm payment (after Stripe processes)
router.post("/confirm", verifyToken, isBuyer, async (req, res) => {
  try {
    const { paymentIntentId, coins, amount } = req.body;

    if (!paymentIntentId || !coins || !amount) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Create payment record
    const payment = new Payment({
      buyer_id: req.userId,
      buyer_email: req.userEmail,
      stripe_id: paymentIntentId,
      amount: parseFloat(amount),
      coins: parseInt(coins),
      status: "completed",
    });

    await payment.save();

    // Add coins to user
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { coins: parseInt(coins) } },
      { new: true },
    );

    res.json({
      message: "Payment successful",
      coins: user.coins,
      payment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to confirm payment", error: error.message });
  }
});

// Get payment history
router.get("/history", verifyToken, isBuyer, async (req, res) => {
  try {
    const payments = await Payment.find({ buyer_id: req.userId }).sort({
      created_date: -1,
    });

    res.json({ payments });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch payment history",
        error: error.message,
      });
  }
});

export default router;
