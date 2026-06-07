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

const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
});

module.exports = { globalLimiter, authLimiter };
