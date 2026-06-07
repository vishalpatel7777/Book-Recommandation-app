const mongoose = require("mongoose");

const readingStatusSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    status: {
      type: String,
      enum: ["want_to_read", "reading", "completed", "dropped"],
      required: true,
    },
    startedAt:   { type: Date, default: null },
    completedAt: { type: Date, default: null },
    progress:    { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

readingStatusSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model("ReadingStatus", readingStatusSchema);
