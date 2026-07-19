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

const { globalLimiter } = require("./middleware/rateLimiter");

const app = express();

// --- Security headers (must be early) ---
app.use(helmet());

// --- CORS ---
app.use(cors(appConfig.cors));
app.options("*", cors(appConfig.cors));

// --- Global rate limiter ---
app.use(globalLimiter);

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
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "BookMosaic API is running.", env: appConfig.nodeEnv });
});

module.exports = app;
