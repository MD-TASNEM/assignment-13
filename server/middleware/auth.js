// Verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Token verification will be implemented with actual JWT
    // For now, this is a placeholder
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Check if user is Worker
export const isWorker = (req, res, next) => {
  if (req.userRole !== "Worker") {
    return res.status(403).json({ message: "Access denied. Workers only." });
  }
  next();
};

// Check if user is Buyer
export const isBuyer = (req, res, next) => {
  if (req.userRole !== "Buyer") {
    return res.status(403).json({ message: "Access denied. Buyers only." });
  }
  next();
};

// Check if user is Admin
export const isAdmin = (req, res, next) => {
  if (req.userRole !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
