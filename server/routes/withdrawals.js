import express from "express";
import Withdrawal from "../models/Withdrawal.js";
import User from "../models/User.js";
import { verifyToken, isWorker, isAdmin } from "../middleware/authUtils.js";

const router = express.Router();

// Request withdrawal (Worker)
router.post("/", verifyToken, isWorker, async (req, res) => {
  try {
    const { withdrawal_coin, payment_system, account_number } = req.body;

    if (!withdrawal_coin || !payment_system || !account_number) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const withdrawal_amount = withdrawal_coin / 20; // 20 coins = $1

    if (withdrawal_coin < 200) {
      return res
        .status(400)
        .json({ message: "Minimum withdrawal is 200 coins ($10)" });
    }

    const user = await User.findById(req.userId);
    if (user.coins < withdrawal_coin) {
      return res.status(400).json({ message: "Insufficient coins" });
    }

    const withdrawal = new Withdrawal({
      worker_id: req.userId,
      worker_email: req.userEmail,
      worker_name: user.name,
      withdrawal_coin: parseInt(withdrawal_coin),
      withdrawal_amount: parseFloat(withdrawal_amount).toFixed(2),
      payment_system,
      account_number,
      status: "pending",
    });

    await withdrawal.save();

    res.status(201).json({
      message: "Withdrawal request submitted",
      withdrawal,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to request withdrawal", error: error.message });
  }
});

// Get worker's withdrawals
router.get(
  "/worker/my-withdrawals",
  verifyToken,
  isWorker,
  async (req, res) => {
    try {
      const withdrawals = await Withdrawal.find({ worker_id: req.userId }).sort(
        { withdraw_date: -1 },
      );

      res.json({ withdrawals });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch withdrawals", error: error.message });
    }
  },
);

// Get all pending withdrawals (Admin)
router.get("/admin/pending", verifyToken, isAdmin, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ status: "pending" }).sort({
      withdraw_date: 1,
    });

    res.json({ withdrawals });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch withdrawals", error: error.message });
  }
});

// Approve withdrawal (Admin)
router.put("/:id/approve", verifyToken, isAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Withdrawal already processed" });
    }

    withdrawal.status = "approved";
    withdrawal.approved_date = new Date();
    await withdrawal.save();

    // Deduct coins from worker
    const worker = await User.findByIdAndUpdate(
      withdrawal.worker_id,
      { $inc: { coins: -withdrawal.withdrawal_coin } },
      { new: true },
    );

    res.json({
      message: "Withdrawal approved",
      withdrawal,
      workerBalance: worker.coins,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to approve withdrawal", error: error.message });
  }
});

// Reject withdrawal (Admin)
router.put("/:id/reject", verifyToken, isAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    withdrawal.status = "rejected";
    await withdrawal.save();

    res.json({
      message: "Withdrawal rejected",
      withdrawal,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to reject withdrawal", error: error.message });
  }
});

// Get withdrawal by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }
    res.json({ withdrawal });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch withdrawal", error: error.message });
  }
});

export default router;
