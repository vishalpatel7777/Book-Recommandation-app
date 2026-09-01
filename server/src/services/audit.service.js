const AuditLog = require("../models/auditLog.model");

async function log({ actor = null, source = "system", action, target = "", meta = null, severity = "info", ip = "" }) {
  try {
    return await AuditLog.create({ actor, source, action, target, meta, severity, ip });
  } catch (e) {
    const logger = require("../config/logger");
    logger.error("AuditLog failed to write", { error: e.message, action, target });
    return null; // fire-and-forget
  }
}

async function getLogs({ actor, action, severity, from, to, page = 1, limit = 10 }) {
  const filter = {};
  if (actor) filter.actor = actor;
  if (action) filter.action = action;
  if (severity) filter.severity = severity;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);
  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

module.exports = { log, getLogs };
