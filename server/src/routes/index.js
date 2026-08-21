const express = require("express");
const router = express.Router();
const { API_PREFIX } = require("../config/paths");

// Import all modular route files
const authRoutes = require("./auth.routes");
const bookRoutes = require("./book.routes");
const wishlistRoutes = require("./wishlist.routes");
const cartRoutes = require("./cart.routes");
const notificationRoutes = require("./notification.routes");
const filterRoutes = require("./filter.routes");
const adminRoutes = require("./admin.routes");
const paymentRoutes = require("./payment.routes");
const orderRoutes = require("./order.routes");
const userRoutes = require("./user.routes");
const readingStatusRoutes = require("./readingStatus.routes");
const commerceRoutes = require("./commerce.routes");
// Import CMS routes
const cmsRoutes = require("./cms.routes");

// Mount all routes
router.use("/", authRoutes);
router.use("/", bookRoutes);
router.use("/", wishlistRoutes);
router.use("/", cartRoutes);
router.use("/", notificationRoutes);
router.use("/", filterRoutes);
router.use("/", adminRoutes);
router.use("/", paymentRoutes);
router.use("/", orderRoutes);
router.use("/", userRoutes);
router.use("/", readingStatusRoutes);
router.use("/", commerceRoutes);
router.use("/", cmsRoutes); // CMS routes

function registerRoutes(app) {
  app.use(API_PREFIX, router); // Change API_PREFIX in paths.js → affects entire API
}

module.exports = { registerRoutes };