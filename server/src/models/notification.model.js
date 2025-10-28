const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model (singular, capitalized)
    required: true,
    index: true, // Add index for faster querying by user
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book", // Reference the Book model (singular, capitalized)
    required: true,
  },
  title: { type: String, required: true },
  image: { type: String, default: "" }, // URL or path
  author: { type: String, default: "Unknown" }, // Added default
  price: { type: Number, default: 0 },
  description: { type: String, default: "" }, // Message like "Purchase successful", etc.
  isRead: { type: Boolean, default: false }, // Optional: Track read status
  createdAt: { type: Date, default: Date.now },
});

// Optional: Auto-delete notifications after a certain period using TTL index
// notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Expires after 30 days (30 * 24 * 60 * 60)

module.exports = mongoose.model("Notification", notificationSchema);