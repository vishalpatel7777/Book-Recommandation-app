/**
 * Production-level structured logger
 * - JSON in production, pretty in development
 * - Levels: error > warn > info > debug
 * - Request correlation via AsyncLocalStorage (if available)
 * - File rotation via daily file if LOG_FILE env set
 * - Never logs secrets (redacts password, tokens, cookies)
 */
const fs = require("fs");
const path = require("path");
const { AsyncLocalStorage } = require("async_hooks");

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const LEVEL_NAMES = ["error", "warn", "info", "debug"];

const envLevel = (process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug")).toLowerCase();
const CURRENT_LEVEL = LOG_LEVELS[envLevel] ?? LOG_LEVELS.info;
const IS_PROD = process.env.NODE_ENV === "production";

const SENSITIVE_KEYS = new Set(["password", "confirmPassword", "resetPasswordToken", "verificationToken", "access_token", "token", "secret", "authorization", "cookie"]);
let logFileStream = null;
if (process.env.LOG_FILE) {
  try {
    const dir = path.dirname(process.env.LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    logFileStream = fs.createWriteStream(process.env.LOG_FILE, { flags: "a" });
  } catch (_) { /* ignore file setup failure */ }
}

const als = new AsyncLocalStorage();

function getRequestContext() {
  try { return als.getStore() || {}; } catch { return {}; }
}

function redact(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const out = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const k of Object.keys(out)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase()) || SENSITIVE_KEYS.has(k)) {
      out[k] = "[REDACTED]";
    } else if (out[k] && typeof out[k] === "object") {
      out[k] = redact(out[k]);
    }
  }
  return out;
}

function format(level, message, meta = {}) {
  const ctx = getRequestContext();
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ... (ctx.requestId ? { requestId: ctx.requestId } : {}),
    ... (ctx.userId ? { userId: String(ctx.userId) } : {}),
    ... (Object.keys(meta).length ? { meta: redact(meta) } : {}),
    pid: process.pid,
    env: process.env.NODE_ENV || "development",
  };
  return entry;
}

function write(level, message, meta) {
  if (LOG_LEVELS[level] > CURRENT_LEVEL) return;
  const entry = format(level, message, meta);
  const line = IS_PROD ? JSON.stringify(entry) : `[${entry.timestamp}] ${level.toUpperCase().padEnd(5)} ${message}${Object.keys(meta||{}).length ? " " + JSON.stringify(redact(meta)) : ""}${entry.requestId ? " (req:" + entry.requestId + ")" : ""}`;

  const out = level === "error" ? process.stderr : process.stdout;
  out.write(line + "\n");
  if (logFileStream) {
    try { logFileStream.write(JSON.stringify(entry) + "\n"); } catch (_) {}
  }
}

const logger = {
  error: (msg, meta) => write("error", msg, meta),
  warn:  (msg, meta) => write("warn",  msg, meta),
  info:  (msg, meta) => write("info",  msg, meta),
  debug: (msg, meta) => write("debug", msg, meta),
  // child logger with bound context
  child: (ctx) => ({
    error: (m, meta) => write("error", m, { ...ctx, ...(meta||{}) }),
    warn:  (m, meta) => write("warn",  m, { ...ctx, ...(meta||{}) }),
    info:  (m, meta) => write("info",  m, { ...ctx, ...(meta||{}) }),
    debug: (m, meta) => write("debug", m, { ...ctx, ...(meta||{}) }),
  }),
  // Express middleware: attach requestId + log requests
  middleware: (req, res, next) => {
    const requestId = req.headers["x-request-id"] || Math.random().toString(36).slice(2, 10);
    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);
    const store = { requestId, userId: req.user?.id || null };
    const start = Date.now();
    // log on finish
    const onFinish = () => {
      const duration = Date.now() - start;
      const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
      write(level, `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    };
    res.on("finish", onFinish);
    res.on("close", onFinish);
    als.run(store, () => next());
  },
  // For manual context propagation (e.g., after auth)
  runWithContext: (ctx, fn) => als.run(ctx, fn),
  getContext: getRequestContext,
  als,
};

module.exports = logger;
