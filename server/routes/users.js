import express from "express";
import User from "../models/User.js";
import { verifyToken, isAdmin } from "../middleware/authUtils.js";

const router = express.Router();

// Get all users
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
});

// Get user by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
});

// Update user profile
router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (req.userId !== req.params.id && req.userRole !== "Admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    const { name, photo_url } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, photo_url, updatedAt: new Date() },
      { new: true },
    ).select("-password");

    res.json({ message: "User updated", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
});

// Update user role (Admin only)
router.put("/:id/role", verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["Worker", "Buyer", "Admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: new Date() },
      { new: true },
    ).select("-password");

    res.json({ message: "User role updated", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user role", error: error.message });
  }
});

// Delete user (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
});

// Get top workers
router.get("/leaderboard/top-workers", async (req, res) => {
  try {
    const workers = await User.find({ role: "Worker" })
      .sort({ coins: -1 })
      .limit(6)
      .select("-password");
    res.json({ workers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch workers", error: error.message });
  }
});

export default router;
