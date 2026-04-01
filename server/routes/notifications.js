import express from "express";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middleware/authUtils.js";

const router = express.Router();

// Create notification (Internal use - called from other routes)
export const createNotification = async (
  to_email,
  to_user_id,
  message,
  action_route = "/dashboard",
) => {
  try {
    const notification = new Notification({
      to_email,
      to_user_id,
      message,
      action_route,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

// Get notifications for current user
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ to_email: req.userEmail })
      .sort({ created_date: -1 })
      .limit(20);

    res.json({ notifications });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch notifications", error: error.message });
  }
});

// Mark notification as read
router.put("/:id/read", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update notification", error: error.message });
  }
});

// Mark all notifications as read
router.put("/read/all", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ to_email: req.userEmail }, { read: true });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to update notifications",
        error: error.message,
      });
  }
});

// Delete notification
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete notification", error: error.message });
  }
});

export default router;
