const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genre: { type: String, trim: true, default: "" },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    booksCount: { type: Number, default: 0, min: 0 },
    followers: { type: Number, default: 0, min: 0 },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    website: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    status: { type: String, enum: ["active", "archived"], default: "active", index: true },
  },
  { timestamps: true }
);

authorSchema.index({ name: "text", bio: "text" });

module.exports = mongoose.model("Author", authorSchema);
