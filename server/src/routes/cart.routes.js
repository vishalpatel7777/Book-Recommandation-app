const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Cart routes require authentication
router.put("/add-to-cart", authenticateToken, cartController.addToCart);
router.put("/remove-book-from-cart", authenticateToken, cartController.removeFromCartByHeader);
router.put("/remove-book-from-cart/:bookid", authenticateToken, cartController.removeFromCartByParam); // Alternate using params
router.post("/clear-cart", authenticateToken, cartController.clearCart);
router.get("/get-user-cart", authenticateToken, cartController.getUserCart);

module.exports = router;