const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Purchase = require("../models/purchase.model");
const Refund = require("../models/refund.model");
const PaymentSettings = require("../models/paymentSettings.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const emailService = require("./email.service");

// ---- Payment Settings ----

const getPaymentSettings = async () => {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
        settings = await PaymentSettings.create({});
    }
    return settings;
};

const updatePaymentSettings = async (updates, adminId) => {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
        settings = new PaymentSettings({});
    }
    const allowed = ["provider", "enabled", "testMode", "currency", "taxPercent", "refundEnabled", "emailReceiptsEnabled"];
    allowed.forEach((key) => {
        if (updates[key] !== undefined) settings[key] = updates[key];
    });
    settings.updatedBy = adminId;
    await settings.save();
    return settings;
};

// ---- Order Management ----

const fetchAllOrders = async (page, limit, status) => {
    const query = status && status !== "all" ? { status } : {};
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const data = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username email")
        .populate("books", "title author image price");
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const fetchOrderById = async (orderId) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID");
    const order = await Order.findById(orderId)
        .populate("user", "username email fullname phone")
        .populate("books", "title author image price genre");
    if (!order) throw new Error("Order not found");
    const purchase = await Purchase.findOne({ order: orderId });
    const refund = await Refund.findOne({ order: orderId });
    return { order, purchase, refund };
};

const updateOrderStatus = async (orderId, status) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID");
    const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true, runValidators: true }
    ).populate("user", "username email");
    if (!order) throw new Error("Order not found");
    return order;
};

// ---- Refund Management ----

const fetchAllRefunds = async (page, limit, status) => {
    const query = status && status !== "all" ? { status } : {};
    const skip = (page - 1) * limit;
    const total = await Refund.countDocuments(query);
    const data = await Refund.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username email")
        .populate("book", "title author image price")
        .populate("order", "status totalPrice paymentMethod")
        .populate("processedBy", "username");
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const processRefund = async (refundId, action, adminId) => {
    if (!mongoose.Types.ObjectId.isValid(refundId)) throw new Error("Invalid refund ID");
    if (!["approved", "rejected"].includes(action)) throw new Error("Invalid action");

    const refund = await Refund.findById(refundId);
    if (!refund) throw new Error("Refund not found");
    if (refund.status !== "pending") throw new Error("Refund already processed");

    refund.status = action;
    refund.processedBy = adminId;
    refund.processedAt = new Date();
    await refund.save();

    // Send refund email (non-fatal)
    try {
        const populated = await Refund.findById(refundId)
            .populate("user", "email username fullname")
            .populate("book", "title amount");
        if (populated?.user?.email) {
            const payload = {
                username: populated.user.username || populated.user.fullname,
                bookTitle: populated.book?.title || "your book",
                amount: refund.amount,
                refundId: refund._id.toString().slice(-6).toUpperCase(),
                reason: refund.reason,
            };
            if (action === "approved") {
                await emailService.sendRefundApprovedEmail(populated.user.email, payload);
            } else {
                await emailService.sendRefundRejectedEmail(populated.user.email, payload);
            }
        }
    } catch {
        // email is non-fatal
    }

    return refund;
};

const createRefundRequest = async (orderId, purchaseId, userId, bookId, amount, reason) => {
    const existing = await Refund.findOne({ order: orderId });
    if (existing) throw new Error("Refund request already exists for this order");

    return Refund.create({ order: orderId, purchase: purchaseId, user: userId, book: bookId, amount, reason });
};

// ---- Admin Library Control ----

const fetchUserLibraryAdmin = async (userId, page, limit) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");
    const query = { user: userId, status: "Completed" };
    const skip = (page - 1) * limit;
    const total = await Purchase.countDocuments(query);
    const data = await Purchase.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("book", "title author image price genre accessMode");
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const grantBookAccess = async (userId, bookId, adminId) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
        throw new Error("Invalid user or book ID");
    }
    const book = await Book.findById(bookId);
    if (!book) throw new Error("Book not found");

    const existing = await Purchase.findOne({ user: userId, book: bookId });
    if (existing) {
        if (existing.status === "Completed") return existing;
        existing.status = "Completed";
        await existing.save();
        return existing;
    }

    const purchase = await Purchase.create({
        user: userId,
        book: bookId,
        paymentMethod: "Admin Grant",
        status: "Completed",
    });

    const order = await Order.create({
        user: userId,
        books: [bookId],
        totalPrice: 0,
        paymentMethod: "Admin Grant",
        status: "Completed",
    });

    purchase.order = order._id;
    await purchase.save();
    await User.findByIdAndUpdate(userId, { $push: { order: order._id } });

    // Send grant email (non-fatal)
    try {
        const userData = await User.findById(userId).select("email username fullname");
        if (userData?.email) {
            await emailService.sendAdminGrantEmail(userData.email, {
                username: userData.username || userData.fullname,
                bookTitle: book.title,
                bookAuthor: book.author,
            });
        }
    } catch {
        // email is non-fatal
    }

    return purchase;
};

const revokeBookAccess = async (userId, bookId) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
        throw new Error("Invalid user or book ID");
    }
    const purchase = await Purchase.findOne({ user: userId, book: bookId });
    if (!purchase) throw new Error("No purchase found for this user and book");
    await purchase.deleteOne();
    return { message: "Access revoked" };
};

// ---- Admin Commerce Analytics ----

const fetchCommerceAnalytics = async () => {
    const totalRevenue = await Purchase.aggregate([
        { $match: { status: "Completed" } },
        { $lookup: { from: "books", localField: "book", foreignField: "_id", as: "bookData" } },
        { $unwind: "$bookData" },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$bookData.price", 0] } } } },
    ]);

    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: "Completed" });
    const pendingRefunds = await Refund.countDocuments({ status: "pending" });
    const totalRefunded = await Refund.countDocuments({ status: "approved" });

    const topCustomers = await Purchase.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: "$user", purchaseCount: { $sum: 1 } } },
        { $sort: { purchaseCount: -1 } },
        { $limit: 5 },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { username: "$user.username", email: "$user.email", purchaseCount: 1 } },
    ]);

    const topBooks = await Purchase.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: "$book", purchaseCount: { $sum: 1 } } },
        { $sort: { purchaseCount: -1 } },
        { $limit: 10 },
        { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
        { $unwind: "$book" },
        { $project: { title: "$book.title", author: "$book.author", price: "$book.price", purchaseCount: 1 } },
    ]);

    const libraryGrowth = await Purchase.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
    ]);

    const monthlyRevenue = await Purchase.aggregate([
        { $match: { status: "Completed" } },
        { $lookup: { from: "books", localField: "book", foreignField: "_id", as: "bookData" } },
        { $unwind: "$bookData" },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: { $ifNull: ["$bookData.price", 0] } } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
    ]);

    return {
        revenue: totalRevenue[0]?.total || 0,
        totalOrders,
        completedOrders,
        pendingRefunds,
        totalRefunded,
        topCustomers,
        topBooks,
        libraryGrowth,
        monthlyRevenue,
    };
};

module.exports = {
    getPaymentSettings,
    updatePaymentSettings,
    fetchAllOrders,
    fetchOrderById,
    updateOrderStatus,
    fetchAllRefunds,
    processRefund,
    createRefundRequest,
    fetchUserLibraryAdmin,
    grantBookAccess,
    revokeBookAccess,
    fetchCommerceAnalytics,
};
