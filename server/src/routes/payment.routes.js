const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { authenticateToken } = require("../middleware/auth.middleware"); // Assuming needed for some verification

// Endpoint to initiate payment and get session ID
router.post("/create-payment", paymentController.createPayment);

// Endpoint to verify payment status (e.g., after successful frontend redirect)
router.post("/verify-payment", paymentController.verifyPayment);

// Endpoint for receiving webhooks from the payment gateway (no auth needed here)
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;