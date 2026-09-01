const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["new_order", "failed_payment", "refund_requested", "refund_processed", "new_user", "new_review", "failed_login", "profile_update"],
      required: true,
      index: true,
    },
    message: { type: String, required: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: null },
    read: { type: Boolean, default: false, index: true },
    severity: { type: String, enum: ["info", "warn", "danger"], default: "info" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

adminNotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model("AdminNotification", adminNotificationSchema);
