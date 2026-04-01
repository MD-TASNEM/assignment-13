import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  buyer_email: {
    type: String,
    required: true,
  },
  stripe_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  coins: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["completed", "failed", "pending"],
    default: "completed",
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payment", paymentSchema);
