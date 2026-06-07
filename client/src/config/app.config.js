/**
 * Frontend application config.
 * Change API_BASE_URL here → all axios calls update automatically.
 * Change APP_NAME here → updates page titles everywhere.
 */

const isDev = import.meta.env.MODE === "development";

const appConfig = {
  APP_NAME: "BookMosaic",
  APP_TAGLINE: "Discover your next great read",

  // API — single source of truth. Change this to update every API call.
  API_BASE_URL: isDev
    ? "http://localhost:1000/api/v1"
    : "https://book-mosaic.onrender.com/api/v1",

  // Feature flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_PAYMENT: true,
    ENABLE_ML_RECOMMENDATIONS: true,
  },
};

export default appConfig;
