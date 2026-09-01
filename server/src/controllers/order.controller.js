const orderService = require("../services/order.service");
const bookService = require("../services/book.service");

const addPurchaseAndOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { book, paymentMethod } = req.body || {};

        if (!book || !paymentMethod) {
            return res.status(400).json({ error: "Missing required fields: book, paymentMethod" });
        }

        // Support both single book and cart array (multi-buy)
        const bookIds = Array.isArray(book) ? book : [book];
        if (bookIds.length === 0) {
            return res.status(400).json({ error: "No books provided" });
        }

        // Multi-book cart order
        if (bookIds.length > 1) {
            const result = await orderService.recordCartPurchase(userId, bookIds, paymentMethod);
            return res.status(201).json({
                message: "Cart purchase recorded successfully",
                orderId: result.order._id,
                order: result.order,
                purchases: result.purchases,
            });
        }

        const { purchase, order } = await orderService.recordPurchaseAndCreateOrder(userId, bookIds[0], paymentMethod);

        res.status(201).json({
            message: "Purchase and Order recorded successfully",
            orderId: order._id,
            purchaseId: purchase._id,
        });
    } catch (error) {
        if (error.message.includes("Invalid user or book ID")) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message.includes("Book not found")) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("already purchased")) {
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
};

const getOrderHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page, limit } = req.query;
        const parsedPage  = page  ? Math.max(1, parseInt(page, 10))  : null;
        const parsedLimit = limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : null;
        const result = await orderService.fetchOrderHistory(userId, parsedPage, parsedLimit);
        if (parsedPage && parsedLimit && result.pagination) {
            return res.json({ success: true, ...result });
        }
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getUserLibrary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page, limit } = req.query;
        const parsedPage  = page  ? Math.max(1, parseInt(page, 10))  : null;
        const parsedLimit = limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : null;
        const result = await orderService.fetchUserLibrary(userId, parsedPage, parsedLimit);
        if (parsedPage && parsedLimit && result.pagination) {
            return res.json({ success: true, ...result });
        }
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const readBook = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.params;

        const bookMeta = await bookService.getBookPdf(bookId);
        if (!bookMeta) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (bookMeta.accessMode === "free") {
            return res.json({ pdfUrl: bookMeta.pdf, title: bookMeta.title });
        }

        if (req.user.role === "admin") {
            return res.json({ pdfUrl: bookMeta.pdf, title: bookMeta.title });
        }

        const owned = await orderService.checkOwnership(userId, bookId);
        if (!owned) {
            return res.status(403).json({ error: "Access denied. Purchase this book to read it." });
        }

        res.json({ pdfUrl: bookMeta.pdf, title: bookMeta.title });
    } catch (error) {
        next(error);
    }
};

module.exports = { addPurchaseAndOrder, getOrderHistory, getUserLibrary, readBook };
