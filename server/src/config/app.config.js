const env = require("./env");

/**
 * Core runtime configuration.
 * Built from validated env — change here → affects CORS, cookies, body limits.
 */
module.exports = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",

  cors: {
    origin: (origin, cb) => {
      // Allow server-to-server / curl (no origin) and any Netlify/Vercel preview + localhost
      if (!origin) return cb(null, true);
      const raw = env.FRONTEND_URL || "";
      const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);
      // Always allow official production frontends + localhost for dev — even if env has single value
      const defaults = ["https://mybookmosaic.netlify.app", "http://localhost:5173", "http://localhost:3000"];
      const list = [...new Set([...allowed, ...defaults])];
      if (list.includes(origin) || /\.netlify\.app$/.test(origin) || /\.onrender\.com$/.test(origin)) return cb(null, true);
      return cb(null, true); // fallback: allow (public GET /branding should never be CORS-blocked); tighten if needed
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "id", "bookid", "authorization", "X-Request-Id"],
    optionsSuccessStatus: 200,
  },

  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    // Must be 'none' for cross-site (Netlify -> Render) with credentials:true
    // strict would block cookie on cross-site requests, causing 401 on /user-information etc.
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  },

  body: {
    jsonLimit: "10mb",
    urlencodedLimit: "10mb",
  },
};
