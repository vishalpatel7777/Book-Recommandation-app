const mongoose = require("mongoose");

const paymentSettingsSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "cashfree", enum: ["cashfree", "razorpay", "stripe", "mock"] },
    enabled: { type: Boolean, default: false },
    testMode: { type: Boolean, default: true },
    currency: { type: String, default: "INR" },
    taxPercent: { type: Number, default: 0, min: 0, max: 100 },
    refundEnabled: { type: Boolean, default: true },
    emailReceiptsEnabled: { type: Boolean, default: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentSettings", paymentSettingsSchema);
