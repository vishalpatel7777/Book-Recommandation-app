const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Correct reference
    required: true,
    index: true, // Index for querying user orders
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", // Correct reference
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0, // Ensure price is non-negative
  },
  paymentMethod: {
    type: String,
    required: true,
    // Optional: enum if you have fixed payment methods
    // enum: ["Online", "COD"],
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Completed", "Cancelled"], // Define possible statuses
    index: true, // Index for querying orders by status
  },
  // Use timestamps: true instead of manual createdAt
  // createdAt: { type: Date, default: Date.now },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model("Order", orderSchema);