const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: "Authentication failed: Missing token." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL: JWT_SECRET environment variable is not set.");
    return res.status(500).json({ message: "Server configuration error." });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed: Invalid or expired token." });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin privileges required." });
  }
  next();
};

const isAuthor = (req, res, next) => {
  if (!req.user || (req.user.role !== "author" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Access denied: Author privileges required." });
  }
  next();
};

const isAuthorOrAdmin = (req, res, next) => {
  if (!req.user || !["author", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied: Author or Admin required." });
  }
  next();
};

module.exports = { authenticateToken, isAdmin, isAuthor, isAuthorOrAdmin };