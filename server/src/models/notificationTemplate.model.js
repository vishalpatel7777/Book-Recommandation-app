const mongoose = require("mongoose");

const notificationTemplateSchema = new mongoose.Schema(
  {
    template: { type: String, required: true, trim: true },
    channel: { type: String, enum: ["email", "push", "sms"], required: true, default: "email" },
    trigger: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "draft", "inactive"], default: "active", index: true },
    subject: { type: String, default: "" },
    message: { type: String, default: "" },
    sent: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationTemplate", notificationTemplateSchema);
