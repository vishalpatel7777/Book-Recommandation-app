const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    url: { type: String }, // Optional, might be removed if not needed
    title: { type: String, required: true, trim: true }, // Added trim
    author: { type: String, required: true, trim: true }, // Added trim
    subject: { type: String }, // Optional
    genre: { type: String, required: true, trim: true }, // Added trim
    desc: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // Ensure non-negative
    language: { type: String, default: "English" }, // Added default
    image: { type: String, required: true }, // URL or path to image
    ratings: { type: Number, min: 0, max: 5, default: 0 }, // Allow 0 for unrated
    pdf: { type: String, required: true }, // URL or path to the PDF file
    // Consider adding index for frequently queried fields like title, author, genre
    // title: { type: String, required: true, trim: true, index: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Optional: Add an index for text search if needed later
// bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

module.exports = mongoose.model("Book", bookSchema); // Use singular "Book" for model name convention