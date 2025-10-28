const orderService = require("../services/order.service");

const addPurchaseAndOrder = async (req, res, next) => {
    try {
        const { user, book, paymentMethod } = req.body || {};
        if (!user || !book || !paymentMethod) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { purchase, order } = await orderService.recordPurchaseAndCreateOrder(user, book, paymentMethod);
        
        res.status(201).json({ 
            message: "Purchase and Order recorded successfully",
            orderId: order._id 
        });
    } catch (error) {
        if (error.message.includes("Invalid user or book ID")) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message.includes("Book not found")) {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
};

module.exports = {
    addPurchaseAndOrder,
    // other order controller methods
};