const express = require("express");
const router = express.Router();

// --- Import all modular route files ---
const authRoutes = require("./auth.routes");
const bookRoutes = require("./book.routes");
const wishlistRoutes = require("./wishlist.routes");
const cartRoutes = require("./cart.routes");
const notificationRoutes = require("./notification.routes");
const filterRoutes = require("./filter.routes");
const adminRoutes = require("./admin.routes"); // Renamed from adminRoutes.js
const paymentRoutes = require("./payment.routes");
const orderRoutes = require("./order.routes");
const userRoutes = require("./user.routes");

// --- Mount all routes onto the router ---
router.use("/", authRoutes); // User & Auth routes
router.use("/", bookRoutes); // Book CRUD & Public Views
router.use("/", wishlistRoutes);
router.use("/", cartRoutes);
router.use("/", notificationRoutes);
router.use("/", filterRoutes); // Genre filtering
router.use("/", adminRoutes); // Admin profile & analytics
router.use("/", paymentRoutes);
router.use("/", orderRoutes);
router.use("/", userRoutes); // User profile routes

/**
 * Registers the main API router with the Express application.
 * @param {express.Application} app The Express application instance.
 */
function registerRoutes(app) {
    app.use("/api/v1", router);
}

module.exports = { registerRoutes };