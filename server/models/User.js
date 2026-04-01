import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    // Not required for Google sign-in users
  },
  role: {
    type: String,
    enum: ["Worker", "Buyer", "Admin"],
    default: "Worker",
  },
  coins: {
    type: Number,
    default: 0,
  },
  photo_url: {
    type: String,
    default: "https://via.placeholder.com/150",
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

export default mongoose.model("User", userSchema);
