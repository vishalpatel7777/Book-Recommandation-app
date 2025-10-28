const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Use singular, capitalized model name
      required: true,
      index: true, // Index for querying user purchases
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", // Use singular, capitalized model name
      required: true,
      index: true, // Index for querying book purchases
    },
    // Optional: Link back to the overall order if an order can contain multiple purchases
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Use singular, capitalized model name
      default: null, // Keep optional if not always linked to an order
    },
    // Status might be more relevant on the Order level, but keeping it here is okay too.
    status: {
      type: String,
      default: "Completed",
      enum: ["Completed", "Pending", "Failed"],
    },
    paymentMethod: {
      type: String,
      required: true,
      // enum: ["Online", "COD"], // Optional
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Use singular, capitalized model name for export
module.exports = mongoose.model("Purchase", purchaseSchema);