const mongoose = require("mongoose");

// steel working on this

const rating = new mongoose.Schema(
  {
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
    rate: {
      type: Number,
    },

    status: {
      type: String,
      default: "thank you for rate the book",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("rating", rating);
