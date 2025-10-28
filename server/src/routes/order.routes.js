const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
// No auth middleware on this file, as purchase details might be verified separately or internally.

router.post("/add-purchase", orderController.addPurchaseAndOrder);
// router.post("/place-order", authenticateToken, orderController.placeOrder); // Placeholder for future

module.exports = router;