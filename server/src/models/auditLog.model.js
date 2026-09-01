const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    source: { type: String, default: "system" }, // system | admin | user
    action: { type: String, required: true, index: true },
    target: { type: String, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed, default: null },
    severity: { type: String, enum: ["info", "warn", "danger"], default: "info", index: true },
    ip: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL 90 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
