const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");
const { validate, validateParams } = require("../middleware/validate.middleware");
const {
    updatePaymentSettingsSchema,
    updateOrderStatusSchema,
    processRefundSchema,
    setAccessModeSchema,
    objectIdParamSchema,
} = require("../validators/commerce.validator");
const ctrl = require("../controllers/commerce.controller");

// Payment Settings
router.get("/admin/payment-settings",  authenticateToken, isAdmin, ctrl.getPaymentSettings);
router.put("/admin/payment-settings",  authenticateToken, isAdmin, validate(updatePaymentSettingsSchema), ctrl.updatePaymentSettings);

// Order Management
router.get("/admin/orders",                               authenticateToken, isAdmin, ctrl.getAllOrders);
router.get("/admin/orders/:orderId",   authenticateToken, isAdmin, validateParams(objectIdParamSchema), ctrl.getOrderById);
router.put("/admin/orders/:orderId/status", authenticateToken, isAdmin, validateParams(objectIdParamSchema), validate(updateOrderStatusSchema), ctrl.updateOrderStatus);

// Refund Management
router.get("/admin/refunds",                                                  authenticateToken, isAdmin, ctrl.getAllRefunds);
router.put("/admin/refunds/:refundId", authenticateToken, isAdmin, validateParams(objectIdParamSchema), validate(processRefundSchema), ctrl.processRefund);

// Library Control
router.get("/admin/users/:userId/library",                         authenticateToken, isAdmin, validateParams(objectIdParamSchema), ctrl.getUserLibraryAdmin);
router.post("/admin/users/:userId/library/:bookId/grant",          authenticateToken, isAdmin, validateParams(objectIdParamSchema), ctrl.grantAccess);
router.delete("/admin/users/:userId/library/:bookId/revoke",       authenticateToken, isAdmin, validateParams(objectIdParamSchema), ctrl.revokeAccess);

// Book Access Mode
router.put("/admin/books/:bookId/access-mode", authenticateToken, isAdmin, validateParams(objectIdParamSchema), validate(setAccessModeSchema), ctrl.setAccessMode);

// Commerce Analytics
router.get("/admin/commerce-analytics", authenticateToken, isAdmin, ctrl.getCommerceAnalytics);

module.exports = router;
