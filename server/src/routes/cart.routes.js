const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { validateHeaders, validateParams } = require("../middleware/validate.middleware");
const { bookidHeaderSchema, bookidParamSchema } = require("../validators/cart.validator");

router.put("/add-to-cart",                   authenticateToken, validateHeaders(bookidHeaderSchema), cartController.addToCart);
router.put("/remove-book-from-cart",         authenticateToken, validateHeaders(bookidHeaderSchema), cartController.removeFromCartByHeader);
router.put("/remove-book-from-cart/:bookid", authenticateToken, validateParams(bookidParamSchema),   cartController.removeFromCartByParam);
router.post("/clear-cart",                   authenticateToken, cartController.clearCart);
router.delete("/clear-cart",                 authenticateToken, cartController.clearCart);
router.get("/get-user-cart",                 authenticateToken, cartController.getUserCart);

module.exports = router;
