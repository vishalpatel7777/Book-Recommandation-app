const mongoose = require("mongoose");
// order schema

const order = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
    },
    status: {
      type: String,
      default: "thank you for purchasing the book",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
