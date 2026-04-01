import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  to_email: {
    type: String,
    required: true,
  },
  to_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  action_route: {
    type: String,
    default: "/dashboard",
  },
  read: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", notificationSchema);
