const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { validate, validateParams } = require("../middleware/validate.middleware");
const { addPurchaseSchema } = require("../validators/order.validator");
const { bookIdParamSchema } = require("../validators/readingStatus.validator");

router.post("/add-purchase", authenticateToken, validate(addPurchaseSchema), orderController.addPurchaseAndOrder);
router.get("/order-history", authenticateToken, orderController.getOrderHistory);
router.get("/library", authenticateToken, orderController.getUserLibrary);
router.get("/library/:bookId/read", authenticateToken, validateParams(bookIdParamSchema), orderController.readBook);

module.exports = router;
