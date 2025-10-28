const paymentService = require("../services/payment.service");

// Handler for POST /create-payment
const createPayment = async (req, res, next) => {
    try {
        const { amount, currency, customer_id, customer_email, customer_phone } = req.body || {};

        if (!amount || !currency || !customer_id || !customer_email || !customer_phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        // Return URL format for Cashfree redirect
        const return_url = `https://bookmosaic.netlify.app/payment-success?order_id={order_id}`;

        const orderData = { amount, currency, customer_id, customer_email, customer_phone, return_url };

        const result = await paymentService.generateOrderSession(orderData);

        res.json({
            orderToken: result.orderToken,
            order_id: result.order_id,
        });
    } catch (error) {
        next(error);
    }
};

// Handler for POST /verify-payment
const verifyPayment = async (req, res, next) => {
    try {
        const { order_id } = req.body || {};
        if (!order_id) {
            return res.status(400).json({ error: "Missing order_id" });
        }

        const verificationResult = await paymentService.handlePaymentVerification(order_id);
        res.json(verificationResult);
    } catch (error) {
        next(error);
    }
};

// Handler for POST /webhook
const handleWebhook = async (req, res, next) => {
    try {
        // Here you should validate the webhook signature before processing
        // ... (Webhook validation middleware is recommended but skipped for now)

        await paymentService.handleWebhook(req.body);

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    verifyPayment,
    handleWebhook,
};