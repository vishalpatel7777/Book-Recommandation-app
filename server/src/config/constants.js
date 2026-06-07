/**
 * App-wide server constants.
 * Change here → affects the entire backend.
 */
module.exports = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  RECENT_BOOKS_LIMIT: 4,
  RECOMMENDED_BOOKS_LIMIT: 4,
  TOP_BOOKS_LIMIT: 5,
  GENRE_BOOKS_DEFAULT_LIMIT: 10,

  // Auth
  JWT_EXPIRES_IN: "30d",
  BCRYPT_SALT_ROUNDS: 10,
  PASSWORD_RESET_EXPIRY_MS: 60 * 60 * 1000, // 1 hour

  // File uploads
  MAX_PDF_SIZE_MB: 60,
  MAX_IMAGE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],

  // API
  API_VERSION: "v1",

  // Book ratings
  MIN_RATING: 0,
  MAX_RATING: 5,

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  AUTH_RATE_LIMIT_MAX: 10,
};
