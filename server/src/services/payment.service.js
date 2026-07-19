const crypto = require("crypto");
const { createCashfreeOrder, verifyCashfreePayment } = require("../utils/paymentHelper");
const orderService = require("./order.service");
const Purchase = require("../models/purchase.model");
const mongoose = require("mongoose");

const generateOrderSession = async (orderData, userId) => {
    const { bookId, amount, currency, customer_id, customer_email, customer_phone } = orderData;

    // Pre-check: don't create a payment session if already purchased
    if (bookId && mongoose.Types.ObjectId.isValid(bookId)) {
        const existing = await Purchase.findOne({ user: userId, book: bookId, status: "Completed" });
        if (existing) throw new Error("Book already purchased");
    }

    const return_url = `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?order_id={order_id}`;
    const result = await createCashfreeOrder({
        amount, currency, customer_id, customer_email, customer_phone, return_url,
        bookId: bookId || null,
        userId: userId ? userId.toString() : null,
    });
    return result;
};

const handlePaymentVerification = async (cashfreeOrderId, userId, bookId, paymentMethod) => {
    const verificationResult = await verifyCashfreePayment(cashfreeOrderId);

    if (verificationResult.status !== "Success") {
        return { success: false, status: verificationResult.status };
    }

    // Idempotent: if already fulfilled (e.g. webhook already processed it), skip
    if (bookId && mongoose.Types.ObjectId.isValid(bookId)) {
        const existing = await Purchase.findOne({ user: userId, book: bookId, status: "Completed" });
        if (existing) {
            return { success: true, alreadyFulfilled: true, purchaseId: existing._id };
        }
        const { purchase, order } = await orderService.recordPurchaseAndCreateOrder(
            userId,
            bookId,
            paymentMethod || "Online"
        );
        return { success: true, orderId: order._id, purchaseId: purchase._id };
    }

    return { success: true, status: verificationResult.status };
};

const handleWebhook = async (webhookData, rawBody, signatureHeader) => {
    const secret = process.env.CASHFREE_SECRET_KEY;
    if (secret && signatureHeader && rawBody) {
        const computed = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");
        if (computed !== signatureHeader) {
            throw new Error("Webhook signature mismatch");
        }
    }

    const { type, data } = webhookData || {};

    if (type === "PAYMENT_SUCCESS_WEBHOOK" && data?.payment?.payment_status === "SUCCESS") {
        const cfOrderId = data.order?.order_id;
        const orderNote = data.order?.order_note || "";
        console.log("[Webhook] Payment success for order:", cfOrderId);

        // Attempt server-side fulfillment when order_note contains bookId:userId
        if (orderNote && orderNote.includes(":")) {
            const [bookId, userId] = orderNote.split(":");
            if (
                mongoose.Types.ObjectId.isValid(bookId) &&
                mongoose.Types.ObjectId.isValid(userId)
            ) {
                try {
                    const existing = await Purchase.findOne({ user: userId, book: bookId, status: "Completed" });
                    if (!existing) {
                        await orderService.recordPurchaseAndCreateOrder(userId, bookId, "Online");
                        console.log("[Webhook] Fulfillment complete — user:", userId, "book:", bookId);
                    } else {
                        console.log("[Webhook] Already fulfilled — skipping:", cfOrderId);
                    }
                } catch (fulfillErr) {
                    console.error("[Webhook] Fulfillment error:", fulfillErr.message);
                }
            }
        }
    }

    if (type === "PAYMENT_FAILED_WEBHOOK") {
        console.log("[Webhook] Payment failed for order:", data?.order?.order_id);
    }

    if (type === "REFUND_SUCCESS_WEBHOOK") {
        console.log("[Webhook] Refund success:", data?.refund?.refund_id);
    }

    if (type === "REFUND_FAILED_WEBHOOK") {
        console.log("[Webhook] Refund failed:", data?.refund?.refund_id);
    }

    return { success: true };
};

module.exports = {
    generateOrderSession,
    handlePaymentVerification,
    handleWebhook,
};
