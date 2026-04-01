import express from "express";
import User from "../models/User.js";
import { generateToken, verifyToken } from "../middleware/authUtils.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, photo_url } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine initial coins
    const initialCoins = role === "Worker" ? 10 : role === "Buyer" ? 50 : 0;

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      coins: initialCoins,
      photo_url: photo_url || `https://via.placeholder.com/150?text=${name[0]}`,
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        photo_url: user.photo_url,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        photo_url: user.photo_url,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        photo_url: user.photo_url,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

export default router;
