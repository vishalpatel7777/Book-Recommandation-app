const errorMiddleware = (err, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";

  // Mongoose: invalid ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
  }

  // Mongoose: validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ message: "Validation failed", errors });
  }

  // Mongoose: duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    message = `${field} already exists.`;
  }

  // JWT: invalid token
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }

  // JWT: expired token
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired, please log in again.";
  }

  const logger = require("../utils/logger");
  logger.error(`${req.method} ${req.originalUrl} → ${statusCode}: ${message}`, {
    statusCode,
    message,
    stack: statusCode === 500 ? err.stack : undefined,
    requestId: req.requestId,
    url: req.originalUrl,
  });

  res.status(statusCode).json({
    message,
    requestId: req.requestId,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorMiddleware };
