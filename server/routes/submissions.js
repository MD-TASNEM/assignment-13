import express from "express";
import Submission from "../models/Submission.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { verifyToken, isWorker, isBuyer } from "../middleware/authUtils.js";

const router = express.Router();

// Create submission (Worker submits task)
router.post("/", verifyToken, isWorker, async (req, res) => {
  try {
    const { task_id, submission_details } = req.body;

    if (!task_id || !submission_details) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const user = await User.findById(req.userId);

    const submission = new Submission({
      task_id,
      task_title: task.title,
      worker_id: req.userId,
      worker_email: req.userEmail,
      worker_name: user.name,
      buyer_id: task.buyer_id,
      buyer_name: task.buyer_name,
      buyer_email: task.buyer_email,
      submission_details,
      payable_amount: task.payable_amount,
      status: "pending",
    });

    await submission.save();

    // Decrease required_workers
    task.required_workers -= 1;
    await task.save();

    res
      .status(201)
      .json({ message: "Submission created successfully", submission });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create submission", error: error.message });
  }
});

// Get all submissions for worker
router.get(
  "/worker/my-submissions",
  verifyToken,
  isWorker,
  async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const submissions = await Submission.find({ worker_email: req.userEmail })
        .sort({ created_date: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Submission.countDocuments({
        worker_email: req.userEmail,
      });

      res.json({
        submissions,
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
        .json({ message: "Failed to fetch submissions", error: error.message });
    }
  },
);

// Get submissions for buyer to review
router.get("/buyer/to-review", verifyToken, isBuyer, async (req, res) => {
  try {
    const submissions = await Submission.find({
      buyer_id: req.userId,
      status: "pending",
    }).sort({ created_date: -1 });

    res.json({ submissions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch submissions", error: error.message });
  }
});

// Approve submission (Buyer approves worker submission)
router.put("/:id/approve", verifyToken, isBuyer, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.buyer_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    submission.status = "approved";
    submission.updated_date = new Date();
    await submission.save();

    // Add coins to worker
    const worker = await User.findOne({ email: submission.worker_email });
    if (worker) {
      worker.coins += submission.payable_amount;
      await worker.save();
    }

    res.json({ message: "Submission approved", submission });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to approve submission", error: error.message });
  }
});

// Reject submission (Buyer rejects worker submission)
router.put("/:id/reject", verifyToken, isBuyer, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.buyer_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    submission.status = "rejected";
    submission.updated_date = new Date();
    await submission.save();

    // Increase required_workers for task
    const task = await Task.findById(submission.task_id);
    if (task) {
      task.required_workers += 1;
      await task.save();
    }

    res.json({ message: "Submission rejected", submission });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to reject submission", error: error.message });
  }
});

// Get submission by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json({ submission });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch submission", error: error.message });
  }
});

export default router;
