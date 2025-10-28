const axios = require("axios");

const CASHFREE_API_URL = process.env.CASHFREE_MODE === "sandbox"
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg";

const CASHFREE_HEADERS = {
    "Content-Type": "application/json",
    "X-Client-Id": process.env.CASHFREE_APP_ID || "",
    "X-Client-Secret": process.env.CASHFREE_SECRET_KEY || "",
    "X-Api-Version": "2025-01-01", // Use a stable API version
};

const createCashfreeOrder = async (orderData) => {
    const { amount, currency, customer_id, customer_email, customer_phone, return_url } = orderData;
    const order_id = `order_${Date.now()}`;

    const request = {
        order_id,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
            customer_id,
            customer_email,
            customer_phone,
        },
        order_meta: {
            return_url: return_url.replace("{order_id}", order_id),
        },
    };

    try {
        const response = await axios.post(
            `${CASHFREE_API_URL}/orders`,
            request,
            { headers: CASHFREE_HEADERS }
        );

        return {
            orderToken: response.data.payment_session_id,
            order_id,
            status: "SUCCESS",
        };
    } catch (error) {
        console.error("Cashfree Order Creation Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create payment order with Cashfree");
    }
};

const verifyCashfreePayment = async (order_id) => {
    try {
        const response = await axios.get(
            `${CASHFREE_API_URL}/orders/${order_id}`,
            { headers: CASHFREE_HEADERS }
        );

        const payments = response.data.payments || [];
        let orderStatus = "Failure";

        if (payments.some((transaction) => transaction.payment_status === "SUCCESS")) {
            orderStatus = "Success";
        } else if (payments.some((transaction) => transaction.payment_status === "PENDING")) {
            orderStatus = "Pending";
        }

        return { order_id, status: orderStatus, details: response.data };
    } catch (error) {
        console.error("Cashfree Verification Error:", error.response?.data || error.message);
        throw new Error("Failed to verify payment with Cashfree");
    }
};

module.exports = {
    createCashfreeOrder,
    verifyCashfreePayment,
};