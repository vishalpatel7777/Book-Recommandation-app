const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Public route to store a notification (usually called by the server after a purchase)
router.post("/add-notification", notificationController.addNotification); 

// Authenticated user routes for fetching and deleting
router.get("/get-notifications/:userId", authenticateToken, notificationController.getNotificationsByUserId);
router.delete("/delete-notification/:id", authenticateToken, notificationController.removeNotification);

module.exports = router;