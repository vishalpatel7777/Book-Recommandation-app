const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ["flat", "percent"], required: true },
    value: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: null, min: 0 },
    maxUses: { type: Number, default: null, min: 1 },
    uses: { type: Number, default: 0, min: 0 },
    minOrder: { type: Number, default: 0, min: 0 },
    min: { type: Number, default: 0 }, // alias for minOrder (frontend compatibility)
    perUser: { type: Number, default: 1 },
    categories: { type: [String], default: [] },
    books: { type: [String], default: [] },
    status: { type: String, enum: ["active", "expired", "disabled", "draft"], default: "active", index: true },
    startDate: { type: String, default: "" },
    expiry: { type: String, default: "" },
    expiresAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

// case-insensitive collation for code lookup handled at query time
couponSchema.index({ code: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

module.exports = mongoose.model("Coupon", couponSchema);
