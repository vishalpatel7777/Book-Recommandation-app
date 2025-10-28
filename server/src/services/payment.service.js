const { createCashfreeOrder, verifyCashfreePayment } = require("../utils/paymentHelper");

const generateOrderSession = async (orderData) => {
    // Logic to validate business rules before calling payment gateway (e.g., check book price)
    // ...
    
    // Call the payment helper to interact with Cashfree
    const result = await createCashfreeOrder(orderData);
    return result;
};

const handlePaymentVerification = async (order_id) => {
    const verificationResult = await verifyCashfreePayment(order_id);
    
    // Logic to update local order status in DB based on verificationResult.status
    // ...

    return verificationResult;
};

// Webhook handling is often placed here or in a dedicated job processor
const handleWebhook = async (webhookData) => {
    const { type, data } = webhookData;

    if (type === "PAYMENT_SUCCESS_WEBHOOK" && data?.payment?.payment_status === "SUCCESS") {
        console.log("Payment successful via webhook for Order ID:", data.order.order_id);
        // Implement logic: update local database order status to 'Completed'
        // If necessary: fulfill the purchase (send email, grant access)
    }
    
    return { success: true };
};


module.exports = {
    generateOrderSession,
    handlePaymentVerification,
    handleWebhook,
};