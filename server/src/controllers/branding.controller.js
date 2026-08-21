const asyncHandler = require("../utils/asyncHandler");
const brandingService = require("../services/branding.service");

/**
 * @swagger
 * /api/v1/cms/branding:
 *   get:
 *     summary: Get current branding settings
 *     tags: [CMS]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Branding settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     siteTitle:
 *                       type: string
 *                     tagline:
 *                       type: string
 *                     logoUrl:
 *                       type: string
 *                     faviconUrl:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description | Forbidden: Admin only
 *   put:
 *     summary: Update branding settings
 *     tags: [CMS]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               siteTitle:
 *                 type: string
 *               tagline:
 *                 type: string
 *     responses:
 *       200:
 *         description: Branding updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     siteTitle:
 *                       type: string
 *                     tagline:
 *                       type: string
 *                     logoUrl:
 *                       type: string
 *                     faviconUrl:
 *                       type: string
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden: Admin only
 */
const getBranding = asyncHandler(async (req, res) => {
  const branding = await brandingService.getBranding();
  res.status(200).json({ success: true, data: branding });
});

/**
 * Update branding settings (text fields)
 */
const updateBranding = asyncHandler(async (req, res) => {
  const { siteTitle, tagline } = req.body;
  const userId = req.user.id; // Assuming req.user is set by auth middleware
  const branding = await brandingService.updateBranding(
    { siteTitle, tagline },
    userId
  );
  res.status(200).json({ success: true, data: branding });
});

/**
 * Upload logo file
 */
const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }
  const userId = req.user.id;
  const logoUrl = await brandingService.uploadBrandingAsset(req.file, "logo");
  const branding = await brandingService.updateBranding(
    { logoUrl },
    userId
  );
  res.status(200).json({ success: true, data: branding });
});

/**
 * Upload favicon file
 */
const uploadFavicon = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }
  const userId = req.user.id;
  const faviconUrl = await brandingService.uploadBrandingAsset(
    req.file,
    "favicon"
  );
  const branding = await brandingService.updateBranding(
    { faviconUrl },
    userId
  );
  res.status(200).json({ success: true, data: branding });
});

module.exports = {
  getBranding,
  updateBranding,
  uploadLogo,
  uploadFavicon,
};