const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 2000 },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["open", "pending", "resolved", "closed"], default: "open", index: true },
    adminReply: { type: String, default: "" },
    repliedAt: { type: Date, default: null },
    customer: { type: String, default: "" }, // denormalized username for quick display
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
