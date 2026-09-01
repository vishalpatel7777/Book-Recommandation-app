const mongoose = require("mongoose");
const Purchase = require("../models/purchase.model");
const Order = require("../models/order.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");
const ReadingStatus = require("../models/readingStatus.model");
const emailService = require("./email.service");

const recordPurchaseAndCreateOrder = async (user, bookId, paymentMethod) => {
    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(bookId)) {
        throw new Error("Invalid user or book ID");
    }

    const bookData = await Book.findById(bookId);
    if (!bookData) {
        throw new Error("Book not found");
    }

    const existingPurchase = await Purchase.findOne({ user, book: bookId });
    if (existingPurchase) {
        throw new Error("Book already purchased");
    }

    // Step 1: Create Purchase record
    const purchase = new Purchase({ user, book: bookId, paymentMethod, status: "Completed" });
    await purchase.save();

    // Step 2: Create Order record
    const order = new Order({
        user,
        books: [bookId],
        totalPrice: bookData.price || 0,
        paymentMethod,
        status: "Completed",
    });
    await order.save();

    // Step 3: Link purchase → order
    purchase.order = order._id;
    await purchase.save();

    // Step 4: Update user.order[] array
    await User.findByIdAndUpdate(user, { $push: { order: order._id } });

    // Step 5: Initialize reading status (non-fatal if already exists)
    try {
        await ReadingStatus.findOneAndUpdate(
            { userId: user, bookId },
            { $setOnInsert: { userId: user, bookId, status: "want_to_read" } },
            { upsert: true, new: true }
        );
    } catch {
        // reading status init is a convenience; don't fail the purchase
    }

    // Step 6: Send purchase confirmation email (non-fatal)
    try {
        const userData = await User.findById(user).select("email username fullname");
        if (userData?.email) {
            await emailService.sendPurchaseConfirmationEmail(userData.email, {
                username: userData.username || userData.fullname,
                bookTitle: bookData.title,
                bookAuthor: bookData.author,
                amount: bookData.price || 0,
                orderId: order._id.toString().slice(-8).toUpperCase(),
                purchaseDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
            });
        }
    } catch {
        // email is non-fatal
    }

    return { purchase, order };
};

// Cart multi-buy: creates one Order with multiple books + one Purchase per book
const recordCartPurchase = async (user, bookIds, paymentMethod) => {
    if (!mongoose.Types.ObjectId.isValid(user)) {
        throw new Error("Invalid user or book ID");
    }
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
        throw new Error("No books provided");
    }
    // Validate all book IDs
    for (const id of bookIds) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid user or book ID");
    }
    const books = await Book.find({ _id: { $in: bookIds } });
    if (books.length !== bookIds.length) {
        throw new Error("Book not found");
    }
    // Check for already purchased books (filter out, don't fail whole cart — skip duplicates)
    const existing = await Purchase.find({ user, book: { $in: bookIds } }).select("book");
    const existingSet = new Set(existing.map(p => p.book.toString()));
    const toPurchase = bookIds.filter(id => !existingSet.has(id.toString()));
    if (toPurchase.length === 0) {
        throw new Error("All books already purchased");
    }
    // If some already purchased, proceed with remaining (partial success)
    const bookMap = Object.fromEntries(books.map(b => [b._id.toString(), b]));
    const totalPrice = toPurchase.reduce((sum, id) => sum + (bookMap[id.toString()]?.price || 0), 0);

    // Create single Order containing all new books
    const order = new Order({
        user,
        books: toPurchase,
        totalPrice,
        paymentMethod,
        status: "Completed",
    });
    await order.save();

    // Create Purchase per book
    const purchases = [];
    for (const bookId of toPurchase) {
        const purchase = new Purchase({ user, book: bookId, paymentMethod, status: "Completed", order: order._id });
        await purchase.save();
        purchases.push(purchase);
        // Reading status
        try {
            await ReadingStatus.findOneAndUpdate(
                { userId: user, bookId },
                { $setOnInsert: { userId: user, bookId, status: "want_to_read" } },
                { upsert: true, new: true }
            );
        } catch {}
    }

    await User.findByIdAndUpdate(user, { $push: { order: order._id } });

    // Email: first book title + count
    try {
        const userData = await User.findById(user).select("email username fullname");
        if (userData?.email) {
            const firstBook = bookMap[toPurchase[0].toString()];
            await emailService.sendPurchaseConfirmationEmail(userData.email, {
                username: userData.username || userData.fullname,
                bookTitle: toPurchase.length > 1 ? `${firstBook.title} + ${toPurchase.length - 1} more` : firstBook.title,
                bookAuthor: firstBook.author,
                amount: totalPrice,
                orderId: order._id.toString().slice(-8).toUpperCase(),
                purchaseDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
            });
        }
    } catch {}

    return { order, purchases };
};

const fetchOrderHistory = async (userId, page, limit) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

    const query = { user: userId };
    if (page && limit) {
        const skip = (page - 1) * limit;
        const total = await Order.countDocuments(query);
        const data = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("books", "title author image price genre");
        return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    return Order.find(query).sort({ createdAt: -1 }).populate("books", "title author image price genre");
};

const fetchUserLibrary = async (userId, page, limit) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

    const query = { user: userId, status: "Completed" };
    if (page && limit) {
        const skip = (page - 1) * limit;
        const total = await Purchase.countDocuments(query);
        const data = await Purchase.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("book", "title author image price genre desc");
        return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    return Purchase.find(query)
        .sort({ createdAt: -1 })
        .populate("book", "title author image price genre desc");
};

const checkOwnership = async (userId, bookId) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
        return false;
    }
    const purchase = await Purchase.findOne({ user: userId, book: bookId, status: "Completed" });
    return !!purchase;
};

module.exports = {
    recordPurchaseAndCreateOrder,
    recordCartPurchase,
    fetchOrderHistory,
    fetchUserLibrary,
    checkOwnership,
};
