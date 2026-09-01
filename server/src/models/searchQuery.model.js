const mongoose = require("mongoose");

const searchQuerySchema = new mongoose.Schema(
  {
    query: { type: String, required: true, trim: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, sparse: true },
    resultCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

searchQuerySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model("SearchQuery", searchQuerySchema);
