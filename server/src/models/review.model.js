const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Use singular, capitalized model name
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book", // Use singular, capitalized model name
    required: true,
  },
  rating: { // Include rating with the review
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: { // The text content of the review
    type: String,
    required: true,
    trim: true, // Remove leading/trailing whitespace
    maxlength: 2000 // Optional: limit review length
  },
  status: {
    type: String,
    enum: ["pending", "published", "flagged", "removed", "approved", "rejected"],
    default: "published",
    index: true,
  },
  comment: { type: String, default: "" }, // alias for review text (frontend compatibility)
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Add a compound unique index to ensure one review per user per book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

// Use singular, capitalized model name for export
module.exports = mongoose.model("Review", reviewSchema);