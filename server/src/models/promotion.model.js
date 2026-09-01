const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    name: { type: String, trim: true, default: "" }, // alias for legacy
    description: { type: String, default: "" },
    badge: { type: String, default: "" },
    cta: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
    ctaUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    bannerImg: { type: String, default: "" },
    type: { type: String, enum: ["Banner", "Popup", "Flash", "Bundle", "Sidebar"], default: "Banner" },
    status: { type: String, enum: ["active", "scheduled", "ended", "draft"], default: "active", index: true },
    scheduledAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    // legacy CMS fields
    starts: { type: String, default: "" },
    ends: { type: String, default: "" },
    discount: { type: String, default: "" },
    priority: { type: Number, default: 1 },
    targetBookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", promotionSchema);
