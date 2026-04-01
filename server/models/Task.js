import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  buyer_name: {
    type: String,
    required: true,
  },
  buyer_email: {
    type: String,
    required: true,
  },
  required_workers: {
    type: Number,
    required: true,
  },
  payable_amount: {
    type: Number,
    required: true,
  },
  completion_date: {
    type: Date,
    required: true,
  },
  submission_info: {
    type: String,
    required: true,
  },
  task_image_url: {
    type: String,
    default: "https://via.placeholder.com/400x300",
  },
  total_payable: {
    type: Number,
    // This is calculated as required_workers * payable_amount
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Task", taskSchema);
