// Central configuration file (e.g., loading environment variables and exporting key settings)

// Note: dotenv is typically loaded in server.cjs/app.cjs, but you can check config here.

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 1000,
  DB_URI: process.env.DB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'bookMosaic_dev_secret',
  // You can expose other validated config settings here
};

// Simple check for required environment variables
if (!config.DB_URI) {
    console.error("FATAL ERROR: DB_URI is not defined.");
    process.exit(1);
}

module.exports = config;