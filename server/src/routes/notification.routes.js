const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { validate, validateParams } = require("../middleware/validate.middleware");
const { addNotificationSchema, notificationIdParamSchema, notificationUserParamSchema } = require("../validators/notification.validator");

router.post("/add-notification", authenticateToken, validate(addNotificationSchema), notificationController.addNotification);
router.get("/get-notifications/:userId", authenticateToken, validateParams(notificationUserParamSchema), notificationController.getNotificationsByUserId);
router.delete("/delete-notification/:id", authenticateToken, validateParams(notificationIdParamSchema), notificationController.removeNotification);

module.exports = router;
