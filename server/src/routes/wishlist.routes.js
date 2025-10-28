const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Wishlist routes require authentication
router.put("/add-to-wishlist", authenticateToken, wishlistController.addToWishlist);
router.put("/remove-book-from-wishlist", authenticateToken, wishlistController.removeFromWishlist);
router.get("/get-all-wishlist", authenticateToken, wishlistController.getAllWishlist);
router.get("/get-recent-wishlist", authenticateToken, wishlistController.getRecentWishlist);

module.exports = router;