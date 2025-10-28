const mongoose = require("mongoose");
const Purchase = require("../models/purchase.model");
const Order = require("../models/order.model");
const Book = require("../models/book.model");

const recordPurchaseAndCreateOrder = async (user, bookId, paymentMethod) => {
    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(bookId)) {
        throw new Error("Invalid user or book ID");
    }

    const bookData = await Book.findById(bookId);
    if (!bookData) {
        throw new Error("Book not found");
    }

    // 1. Create Purchase Record
    const purchase = new Purchase({ user, book: bookId, paymentMethod });
    await purchase.save();

    // 2. Create Order Record
    const order = new Order({
        user,
        books: [bookId], // Assuming 1 book per transaction/purchase for simplicity
        totalPrice: bookData.price || 0,
        paymentMethod,
        status: 'Completed' // Assuming purchase is successful at this point
    });
    await order.save();

    // 3. Link Purchase to Order (if necessary, though Order might reference Purchase)
    purchase.order = order._id;
    await purchase.save();

    return { purchase, order };
};

module.exports = {
    recordPurchaseAndCreateOrder,
    // Other order-related services (like fetchOrderHistory, getOrderDetails)
};