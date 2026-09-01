const env = require("./config/env");           // MUST be first — validates env on boot
const appConfig = require("./config/app.config");
const paths = require("./config/paths");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const { apiLimiter } = require("./middleware/rateLimiter");
const logger = require("./utils/logger");

const app = express();

// --- Request ID + structured logging (must be early for correlation) ---
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || Math.random().toString(36).slice(2, 10);
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
});

// --- Security headers (must be early) ---
app.use(helmet());

// --- CORS ---
app.use(cors(appConfig.cors));
app.options("*", cors(appConfig.cors));

// --- Rate limiter: per-route (NOT global) — admin can refresh as needed ---
// Previous globalLimiter (100 req/15min) caused 429 on admin navigating /admin/cms sections.
// Now apiLimiter is 1000 req/15min and skips admin users (checked via JWT cookie in skip function).
// Auth routes keep strict authLimiter (10/15min) separately in auth.routes.js.
app.use(apiLimiter);

// --- Body parsing ---
// Capture raw body for webhook HM  AC verification before JSON parsing
app.use((req, res, next) => {
    if (req.path.endsWith("/webhook")) {
        let data = "";
        req.setEncoding("utf8");
        req.on("data", (chunk) => { data += chunk; });
        req.on("end", () => {
            req.rawBody = data;
            try { req.body = JSON.parse(data); } catch { req.body = {}; }
            next();
        });
    } else {
        next();
    }
});
app.use(express.json({ limit: appConfig.body.jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: appConfig.body.urlencodedLimit }));
app.use(cookieParser());

// --- Sanitization (after body parsing) ---
app.use(mongoSanitize());   // strip $ and . from req.body / req.query / req.params
app.use(xss());             // strip HTML tags from string inputs
app.use(hpp());             // remove duplicate query-string params

// --- Static file serving ---
if (!fs.existsSync(paths.UPLOAD_DIR)) {
  fs.mkdirSync(paths.UPLOAD_DIR, { recursive: true });
}
app.use(paths.UPLOAD_STATIC_ROUTE, express.static(paths.UPLOAD_DIR, {
  setHeaders: (res) => {
    res.set("Cache-Control", "public, max-age=31536000");
  },
}));

// --- Routes ---
const { registerRoutes } = require("./routes/index");
const { errorMiddleware } = require("./middleware/error.middleware");

registerRoutes(app);

// --- 404 handler (before error middleware) ---
app.use((req, res) => {
  logger.warn("Route not found", { method: req.method, url: req.originalUrl });
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "BookMosaic API is running.", env: appConfig.nodeEnv });
});

module.exports = app;
