const mongoose = require("mongoose");

// Renamed the function for clarity
const connectToDb = async () => {
  try {
    // Retrieve URI from environment variables (ensure dotenv is configured in app.cjs or server.cjs)
    const uri = process.env.DB_URI || ""; // Use a standard name like DB_URI
    if (!uri) {
      throw new Error("MongoDB URI (DB_URI) is not provided in environment variables");
    }
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully."); // Added success emoji
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Exit the process with failure code if connection fails
    process.exit(1);
  }
};

// Export the function instead of calling it immediately
module.exports = { connectToDb };