const path = require("path");
const os = require("os");
const { API_VERSION } = require("./constants");

/**
 * Central file paths and route prefixes.
 * Change here → affects all uploads and API prefix.
 */
module.exports = {
  // API route prefix — consumed by routes/index.js
  API_PREFIX: `/api/${API_VERSION}`,

  // Upload directories
  UPLOAD_DIR: os.tmpdir(),
  UPLOAD_STATIC_ROUTE: "/uploads",

  // Log directory (for future use with Winston file transport)
  LOGS_DIR: path.join(__dirname, "../../../logs"),
};
