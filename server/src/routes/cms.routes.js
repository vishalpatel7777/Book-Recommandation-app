const express = require("express");
const router = express.Router();
const {
  getBranding,
  updateBranding,
  uploadLogo,
  uploadFavicon,
} = require("../controllers/branding.controller");

// Apply multer middleware for file uploads
const { upload } = require("../middleware/upload.middleware");

// Get current branding settings
router.get("/cms/branding", getBranding);

// Update branding text fields (site title, tagline)
router.put("/cms/branding", updateBranding);

// Upload logo
router.post("/cms/branding/logo", upload.single("file"), uploadLogo);

// Upload favicon
router.post("/cms/branding/favicon", upload.single("file"), uploadFavicon);

module.exports = router;