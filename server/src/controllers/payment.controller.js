const paymentService = require("../services/payment.service");

const createPayment = async (req, res, next) => {
    try {
        const { bookId, amount, currency, customer_id, customer_email, customer_phone } = req.body || {};

        if (!amount || !currency || !customer_id || !customer_email || !customer_phone) {
            return res.status(400).json({ error: "Missing required fields: amount, currency, customer_id, customer_email, customer_phone" });
        }

        const result = await paymentService.generateOrderSession(
            { bookId, amount, currency, customer_id, customer_email, customer_phone },
            req.user.id
        );

        res.json({ orderToken: result.orderToken, order_id: result.order_id });
    } catch (error) {
        if (error.message === "Book already purchased") {
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
};

const verifyPayment = async (req, res, next) => {
    try {
        const { order_id, bookId, paymentMethod } = req.body || {};
        if (!order_id) {
            return res.status(400).json({ error: "Missing order_id" });
        }

        const result = await paymentService.handlePaymentVerification(
            order_id,
            req.user.id,
            bookId,
            paymentMethod
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const handleWebhook = async (req, res, next) => {
    try {
        const rawBody = req.rawBody;
        const signatureHeader = req.headers["x-webhook-signature"];
        await paymentService.handleWebhook(req.body, rawBody, signatureHeader);
        res.status(200).json({ success: true });
    } catch (error) {
        if (error.message === "Webhook signature mismatch") {
            return res.status(401).json({ error: "Invalid webhook signature" });
        }
        next(error);
    }
};

module.exports = {
    createPayment,
    verifyPayment,
    handleWebhook,
};
