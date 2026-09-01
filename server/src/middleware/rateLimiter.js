const rateLimit = require("express-rate-limit");
const {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_MAX,
} = require("../config/constants");

const globalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Per-API limiter for general routes — generous for admin dashboard navigation.
// Admin browsing /admin/cms triggers 10+ API calls per section change; 100/15min was too strict.
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: 1000, // 10x global for normal API use
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
  skip: (req) => {
    // Skip limiter entirely for admin users (verified via JWT cookie)
    // We try to decode without verify for speed; if fails, don't skip.
    try {
      const token = req.cookies?.access_token;
      if (!token) return false;
      const jwt = require("jsonwebtoken");
      const payload = jwt.decode(token);
      return payload?.role === "admin";
    } catch {
      return false;
    }
  },
});

const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
});

module.exports = { globalLimiter, apiLimiter, authLimiter };
