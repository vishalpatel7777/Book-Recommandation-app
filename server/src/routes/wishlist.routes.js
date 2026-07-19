const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { validateHeaders } = require("../middleware/validate.middleware");
const { bookidHeaderSchema } = require("../validators/wishlist.validator");

router.put("/add-to-wishlist",            authenticateToken, validateHeaders(bookidHeaderSchema), wishlistController.addToWishlist);
router.put("/remove-book-from-wishlist",  authenticateToken, validateHeaders(bookidHeaderSchema), wishlistController.removeFromWishlist);
router.get("/get-all-wishlist",           authenticateToken, wishlistController.getAllWishlist);
router.get("/get-recent-wishlist",        authenticateToken, wishlistController.getRecentWishlist);

module.exports = router;
