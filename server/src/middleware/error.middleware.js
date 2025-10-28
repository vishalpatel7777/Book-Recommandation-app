/**
 * Central Error Handling Middleware.
 * This catches all synchronous and asynchronous errors passed via next(error).
 */
const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(`❌ [Error Handler] Path: ${req.originalUrl} | Status: ${statusCode} | Message: ${err.message}`);
    // Log the full stack trace for server-side debugging
    if (statusCode === 500) {
        console.error(err.stack); 
    }

    // Handle specific MongoDB/Mongoose errors if necessary
    // E.g., Duplicate key error for unique fields
    if (err.code === 11000) {
        return res.status(409).json({ 
            message: "Duplicate entry detected.",
            error: err.message,
        });
    }

    res.status(statusCode).json({
        message: err.message,
        // Only include stack trace if in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = { errorMiddleware };