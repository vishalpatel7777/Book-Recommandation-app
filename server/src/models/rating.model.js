const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Use singular, capitalized model name
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", // Use singular, capitalized model name
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 1, // Minimum rating
      max: 5, // Maximum rating
    },
    // Removed 'status' field, as it's typically response data, not stored data.
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Add a compound unique index to ensure one rating per user per book
ratingSchema.index({ user: 1, book: 1 }, { unique: true });

// Use singular, capitalized model name for export
module.exports = mongoose.model("Rating", ratingSchema);