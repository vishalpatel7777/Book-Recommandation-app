const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
// IMPORTANT: Use path.join to safely resolve directories across OS types
const os = require('os');
require("dotenv").config(); 

const app = express();

// --- General Middleware ---
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- Route Imports ---
const { registerRoutes } = require("./routes/index"); // Path is now local to src/
// Import the central error handling middleware
const { errorMiddleware } = require("./middleware/error.middleware");

// --- Static Serving ---
// CRITICAL: Multer uses os.tmpdir() which is different from your project root.
const tempDir = os.tmpdir(); 

// Ensure the temporary directory exists (Multer needs it)
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

app.use("/uploads", express.static(tempDir, { 
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'public, max-age=31536000');
    }
}));


// --- API Route Registration ---
registerRoutes(app);

// --- Central Error Handler (Must be placed last) ---
app.use(errorMiddleware);

// --- Root Health Check ---
app.get('/', (req, res) => {
    res.status(200).json({ status: "ok", message: "BookMosaic API is running." });
});

module.exports = app;