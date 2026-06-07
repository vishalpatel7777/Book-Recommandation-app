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
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "id", "bookid", "authorization"],
    optionsSuccessStatus: 200,
  },

  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  },

  body: {
    jsonLimit: "10mb",
    urlencodedLimit: "10mb",
  },
};
