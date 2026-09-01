const mongoose = require("mongoose");

const homepageBlockSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true, default: "home", index: true },
    blocks: {
      type: [
        {
          blockId: { type: String, required: true },
          type: { type: String, required: true },
          status: { type: String, enum: ["active", "inactive", "draft"], default: "active" },
          order: { type: Number, required: true },
          headline: { type: String, default: "" },
          subtext: { type: String, default: "" },
          bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", default: null },
          authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", default: null },
          imageUrl: { type: String, default: "" },
          imagePublicId: { type: String, default: "" },
          bgImage: { type: String, default: "" },
          ctaText: { type: String, default: "" },
          discount: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomepageBlock", homepageBlockSchema);
