import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import submissionRoutes from "./routes/submissions.js";
import paymentRoutes from "./routes/payments.js";
import withdrawalRoutes from "./routes/withdrawals.js";
import notificationRoutes from "./routes/notifications.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Server is running", timestamp: new Date() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   GET  /api/health                      - Health check`);
  console.log(`   POST /api/auth/register               - Register user`);
  console.log(`   POST /api/auth/login                  - Login user`);
  console.log(`   GET  /api/tasks                       - Get all tasks`);
  console.log(`   POST /api/tasks                       - Create task (Buyer)`);
  console.log(`   POST /api/submissions                 - Submit task (Worker)`);
  console.log(`   POST /api/payments/create-intent      - Create payment (Buyer)`);
  console.log(`   POST /api/withdrawals                 - Request withdrawal (Worker)`);
});
});
