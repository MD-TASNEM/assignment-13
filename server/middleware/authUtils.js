import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isWorker = (req, res, next) => {
  if (req.userRole !== "Worker") {
    return res.status(403).json({ message: "Access denied. Workers only." });
  }
  next();
};

export const isBuyer = (req, res, next) => {
  if (req.userRole !== "Buyer") {
    return res.status(403).json({ message: "Access denied. Buyers only." });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
