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

router.use(authenticateToken, isAdmin);

// Payment Settings
router.get("/admin/payment-settings",  ctrl.getPaymentSettings);
router.put("/admin/payment-settings",  validate(updatePaymentSettingsSchema), ctrl.updatePaymentSettings);

// Order Management
router.get("/admin/orders",                               ctrl.getAllOrders);
router.get("/admin/orders/:orderId",   validateParams(objectIdParamSchema), ctrl.getOrderById);
router.put("/admin/orders/:orderId/status", validateParams(objectIdParamSchema), validate(updateOrderStatusSchema), ctrl.updateOrderStatus);

// Refund Management
router.get("/admin/refunds",                                                  ctrl.getAllRefunds);
router.put("/admin/refunds/:refundId", validateParams(objectIdParamSchema), validate(processRefundSchema), ctrl.processRefund);

// Library Control
router.get("/admin/users/:userId/library",                         validateParams(objectIdParamSchema), ctrl.getUserLibraryAdmin);
router.post("/admin/users/:userId/library/:bookId/grant",          validateParams(objectIdParamSchema), ctrl.grantAccess);
router.delete("/admin/users/:userId/library/:bookId/revoke",       validateParams(objectIdParamSchema), ctrl.revokeAccess);

// Book Access Mode
router.put("/admin/books/:bookId/access-mode", validateParams(objectIdParamSchema), validate(setAccessModeSchema), ctrl.setAccessMode);

// Commerce Analytics
router.get("/admin/commerce-analytics", ctrl.getCommerceAnalytics);

module.exports = router;
