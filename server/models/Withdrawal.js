import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
  worker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  worker_email: {
    type: String,
    required: true,
  },
  worker_name: {
    type: String,
    required: true,
  },
  withdrawal_coin: {
    type: Number,
    required: true,
  },
  withdrawal_amount: {
    type: Number,
    required: true,
  },
  payment_system: {
    type: String,
    enum: ["Stripe", "Bkash", "Rocket", "Nagad", "Bank Transfer"],
    required: true,
  },
  account_number: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  withdraw_date: {
    type: Date,
    default: Date.now,
  },
  approved_date: {
    type: Date,
  },
});

export default mongoose.model("Withdrawal", withdrawalSchema);
