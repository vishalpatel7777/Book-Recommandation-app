const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.post("/create-payment", authenticateToken, paymentController.createPayment);
router.post("/verify-payment", authenticateToken, paymentController.verifyPayment);
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
