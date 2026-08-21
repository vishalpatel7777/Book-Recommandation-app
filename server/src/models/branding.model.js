const mongoose = require("mongoose");

const brandingSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, required: true },
    tagline: { type: String },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branding", brandingSchema);