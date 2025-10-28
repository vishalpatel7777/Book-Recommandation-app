const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token and attach user payload to req.user.
 */
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header (Bearer token) or fallback to req.headers.token
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  
  // NOTE: Your original client code often sends token in headers['authorization'] AND headers.token/headers.id
  // This version prefers the standard 'Authorization: Bearer <token>' format.

  if (!token) {
    return res.status(401).json({ message: "Authentication failed: Missing token." });
  }

  jwt.verify(token, process.env.JWT_SECRET || "bookMosaic017", (err, user) => {
    if (err) {
      // 403 Forbidden is used for invalid/expired token
      return res.status(403).json({ message: "Authentication failed: Invalid or expired token." });
    }
    
    // The decoded JWT payload (which contains id and role) is attached to the request
    req.user = user; 
    next();
  });
};

/**
 * Middleware to check if the authenticated user has the 'admin' role.
 * Requires authenticateToken to run first.
 */
const isAdmin = (req, res, next) => {
    // Check if the user object was attached by authenticateToken and if the role is admin
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied: Admin privileges required." });
    }
    next();
};

module.exports = {
  authenticateToken,
  isAdmin,
};