const fs = require("fs");
const path = require("path");

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[(process.env.LOG_LEVEL || "info").toLowerCase()] ?? LEVELS.info;
const logFile = process.env.LOG_FILE;

function shouldLog(level) {
  return LEVELS[level] <= currentLevel;
}

function write(level, message, meta) {
  if (!shouldLog(level)) return;
  if (process.env.NODE_ENV === "test" && level === "info") return;
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta && typeof meta === "object" ? meta : meta ? { meta } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
  if (logFile) {
    try {
      const dir = path.dirname(logFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(logFile, line + "\n");
    } catch {}
  }
}

const logger = {
  info: (msg, meta) => write("info", msg, meta),
  warn: (msg, meta) => write("warn", msg, meta),
  error: (msg, meta) => write("error", msg, meta),
  debug: (msg, meta) => write("debug", msg, meta),
};

module.exports = logger;