const mongoose = require("mongoose");

const mediaAssetSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, default: "" },
    name: { type: String, default: "" },
    type: { type: String, enum: ["image", "banner", "logo", "pdf", "video", "other"], default: "image" },
    mimeType: { type: String, default: "" },
    sizeBytes: { type: Number, default: 0 },
    size: { type: String, default: "" }, // human readable e.g. "84 KB"
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", default: null },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    folder: { type: String, default: "" },
    used: { type: Boolean, default: false },
    usedIn: { type: [String], default: [] },
  },
  { timestamps: { createdAt: "uploadedAt", updatedAt: true } }
);

module.exports = mongoose.model("MediaAsset", mediaAssetSchema);
