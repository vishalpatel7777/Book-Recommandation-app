const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware"); // Assuming you create isAdmin middleware

// All routes here will run AdminController methods after authentication.

// Profile Routes (Read and Update)
router.get("/get-admin-profile", authenticateToken, isAdmin, adminController.getAdminProfile);
router.put("/update-admin-profile", authenticateToken, isAdmin, adminController.updateAdminProfile);

// Dashboard/Analytics Routes (No specific authentication check needed here if already protected by a higher middleware, but keeping isAdmin for safety)
router.get("/daily", authenticateToken, isAdmin, adminController.getDailyStats);
router.get("/user-activity", authenticateToken, isAdmin, adminController.getUserActivity);
router.get("/book-analytics", authenticateToken, isAdmin, adminController.getBookAnalytics);
router.get("/monthly-analytics", authenticateToken, isAdmin, adminController.getMonthlyAnalytics);
router.get("/monthly-stats", authenticateToken, isAdmin, adminController.getMonthlySignups); // <-- New route

module.exports = router;