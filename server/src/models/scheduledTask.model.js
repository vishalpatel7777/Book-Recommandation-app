const mongoose = require("mongoose");

const scheduledTaskSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Book", "Promotion", "Homepage", "Notification"], required: true },
    name: { type: String, required: true, trim: true },
    action: { type: String, required: true }, // Publish | Activate | Send | Archive
    scheduledAt: { type: Date, required: true },
    scheduledAtLabel: { type: String, default: "" },
    tz: { type: String, default: "IST" },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending", index: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScheduledTask", scheduledTaskSchema);
