const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    icon: { type: String, default: "" },
    color: { type: String, default: "" },
    count: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDesc: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "archived"], default: "active", index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
