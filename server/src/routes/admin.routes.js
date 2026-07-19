const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { updateAdminProfileSchema } = require("../validators/admin.validator");

router.get("/get-admin-profile",   authenticateToken, isAdmin, adminController.getAdminProfile);
router.put("/update-admin-profile", authenticateToken, isAdmin, validate(updateAdminProfileSchema), adminController.updateAdminProfile);

router.get("/daily",             authenticateToken, isAdmin, adminController.getDailyStats);
router.get("/user-activity",     authenticateToken, isAdmin, adminController.getUserActivity);
router.get("/book-analytics",    authenticateToken, isAdmin, adminController.getBookAnalytics);
router.get("/monthly-analytics", authenticateToken, isAdmin, adminController.getMonthlyAnalytics);
router.get("/monthly-stats",     authenticateToken, isAdmin, adminController.getMonthlySignups);

module.exports = router;
