import express from "express";
import Task from "../models/Task.js";
import { verifyToken, isBuyer, isWorker } from "../middleware/authUtils.js";

const router = express.Router();

// Get all tasks (for workers to see available tasks)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = { required_workers: { $gt: 0 } };
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// Get task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch task", error: error.message });
  }
});

// Create task (Buyer only)
router.post("/", verifyToken, isBuyer, async (req, res) => {
  try {
    const {
      title,
      detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
    } = req.body;

    if (
      !title ||
      !detail ||
      !required_workers ||
      !payable_amount ||
      !completion_date
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const task = new Task({
      title,
      detail,
      buyer_id: req.userId,
      buyer_name: req.body.buyer_name || "Buyer",
      buyer_email: req.userEmail,
      required_workers: parseInt(required_workers),
      payable_amount: parseFloat(payable_amount),
      completion_date,
      submission_info,
      task_image_url: task_image_url || "https://via.placeholder.com/400x300",
      total_payable: parseInt(required_workers) * parseFloat(payable_amount),
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
});

// Update task (Buyer only)
router.put("/:id", verifyToken, isBuyer, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.buyer_id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const { title, detail, submission_info } = req.body;
    if (title) task.title = title;
    if (detail) task.detail = detail;
    if (submission_info) task.submission_info = submission_info;
    task.updatedAt = new Date();

    await task.save();
    res.json({ message: "Task updated", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update task", error: error.message });
  }
});

// Delete task (Buyer only)
router.delete("/:id", verifyToken, isBuyer, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.buyer_id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({
      message: "Task deleted",
      refundAmount: task.total_payable,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
});

// Get buyer's tasks
router.get("/buyer/my-tasks", verifyToken, isBuyer, async (req, res) => {
  try {
    const tasks = await Task.find({ buyer_id: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ tasks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
});

export default router;
