const Branding = require("../models/branding.model");
const { uploadToGoogleDrive, cleanupLocalFile } = require("../utils/s3Helper");
const path = require("path");
const fs = require("fs");

/**
 * Get the current branding settings
 * @returns {Promise<Object>} Branding document
 */
const getBranding = async () => {
  // Assuming there is only one branding document
  let branding = await Branding.findOne({});
  if (!branding) {
    // Create default branding if none exists
    branding = await Branding.create({
      siteTitle: "BookMosaic",
      tagline: "A World of Literature",
    });
  }
  return branding;
};

/**
 * Update branding settings
 * @param {Object} updates - Fields to update
 * @param {string} userId - ID of the user making the update
 * @returns {Promise<Object>} Updated branding document
 */
const updateBranding = async (updates, userId) => {
  const branding = await getBranding();
  Object.assign(branding, updates, { updatedBy: userId });
  return await branding.save();
};

/**
 * Handle file upload for branding assets (logo or favicon)
 * @param {Object} file - File object from multer
 * @param {string} type - Either 'logo' or 'favicon'
 * @returns {Promise<string>} URL of the uploaded file
 */
const uploadBrandingAsset = async (file, type) => {
  // Validate file type
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type for ${type}. Only JPG, PNG, SVG, and GIF are allowed.`);
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`File size too large for ${type}. Maximum size is 5MB.`);
  }

  try {
    // Generate a unique filename
    const fileName = `branding-${type}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Upload to Google Drive
    const url = await uploadToGoogleDrive(file.path, fileName);
    // Clean up local file
    await cleanupLocalFile(file.path);
    return url;
  } catch (error) {
    // Clean up local file on error
    if (file.path && fs.existsSync(file.path)) {
      await cleanupLocalFile(file.path);
    }
    throw error;
  }
};

module.exports = {
  getBranding,
  updateBranding,
  uploadBrandingAsset,
};