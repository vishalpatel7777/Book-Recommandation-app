const commerceService = require("../services/commerce.service");
const bookService = require("../services/book.service");
const asyncHandler = require("../utils/asyncHandler");

// Payment Settings
const getPaymentSettings = asyncHandler(async (req, res) => {
    const settings = await commerceService.getPaymentSettings();
    res.json(settings);
});

const updatePaymentSettings = asyncHandler(async (req, res) => {
    const settings = await commerceService.updatePaymentSettings(req.body, req.user.id);
    res.json(settings);
});

// Order Management
const getAllOrders = asyncHandler(async (req, res) => {
    const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const { status } = req.query;
    const result = await commerceService.fetchAllOrders(page, limit, status);
    res.json({ success: true, ...result });
});

const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await commerceService.fetchOrderById(orderId);
        res.json({ success: true, ...result });
    } catch (err) {
        if (err.message.includes("not found") || err.message.includes("Invalid")) {
            return res.status(404).json({ error: err.message });
        }
        throw err;
    }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status is required" });
    try {
        const order = await commerceService.updateOrderStatus(orderId, status);
        res.json({ success: true, order });
    } catch (err) {
        if (err.message.includes("not found") || err.message.includes("Invalid")) {
            return res.status(404).json({ error: err.message });
        }
        throw err;
    }
});

// Refund Management
const getAllRefunds = asyncHandler(async (req, res) => {
    const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const { status } = req.query;
    const result = await commerceService.fetchAllRefunds(page, limit, status);
    res.json({ success: true, ...result });
});

const processRefund = asyncHandler(async (req, res) => {
    const { refundId } = req.params;
    const { action } = req.body;
    if (!action) return res.status(400).json({ error: "action is required: approved | rejected" });
    try {
        const refund = await commerceService.processRefund(refundId, action, req.user.id);
        res.json({ success: true, refund });
    } catch (err) {
        if (err.message.includes("not found") || err.message.includes("Invalid") || err.message.includes("already processed") || err.message.includes("Invalid action")) {
            return res.status(400).json({ error: err.message });
        }
        throw err;
    }
});

// Admin Library Control
const getUserLibraryAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    try {
        const result = await commerceService.fetchUserLibraryAdmin(userId, page, limit);
        res.json({ success: true, ...result });
    } catch (err) {
        if (err.message.includes("Invalid")) return res.status(400).json({ error: err.message });
        throw err;
    }
});

const grantAccess = asyncHandler(async (req, res) => {
    const { userId, bookId } = req.params;
    try {
        const purchase = await commerceService.grantBookAccess(userId, bookId, req.user.id);
        res.status(201).json({ success: true, purchase });
    } catch (err) {
        if (err.message.includes("not found") || err.message.includes("Invalid")) {
            return res.status(404).json({ error: err.message });
        }
        throw err;
    }
});

const revokeAccess = asyncHandler(async (req, res) => {
    const { userId, bookId } = req.params;
    try {
        const result = await commerceService.revokeBookAccess(userId, bookId);
        res.json({ success: true, ...result });
    } catch (err) {
        if (err.message.includes("not found") || err.message.includes("Invalid")) {
            return res.status(404).json({ error: err.message });
        }
        throw err;
    }
});

// Book Access Mode (Part 7)
const setAccessMode = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { accessMode } = req.body;
    if (!accessMode) return res.status(400).json({ error: "accessMode is required" });
    try {
        const book = await bookService.setBookAccessMode(bookId, accessMode);
        res.json({ success: true, book });
    } catch (err) {
        if (err.message.includes("not found")) return res.status(404).json({ error: err.message });
        throw err;
    }
});

// Commerce Analytics (Part 9)
const getCommerceAnalytics = asyncHandler(async (req, res) => {
    const analytics = await commerceService.fetchCommerceAnalytics();
    res.json({ success: true, ...analytics });
});

module.exports = {
    getPaymentSettings,
    updatePaymentSettings,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getAllRefunds,
    processRefund,
    getUserLibraryAdmin,
    grantAccess,
    revokeAccess,
    setAccessMode,
    getCommerceAnalytics,
};
