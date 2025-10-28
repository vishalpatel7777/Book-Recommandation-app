const wishlistService = require("../services/wishlist.service");

// Handler for PUT /add-to-wishlist
const addToWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        const { bookid } = req.headers || {};

        if (!bookid || !userId) {
            return res.status(400).json({ message: "Missing bookid or user id" });
        }

        const result = await wishlistService.addBookToWishlist(userId, bookid);
        
        // Use the status from the service logic
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Handler for PUT /remove-book-from-wishlist
const removeFromWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        const { bookid } = req.headers || {};

        if (!bookid || !userId) {
            return res.status(400).json({ message: "Missing bookid or user id" });
        }

        const result = await wishlistService.removeBookFromWishlist(userId, bookid);
        
        // Use the status from the service logic
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Handler for GET /get-all-wishlist
const getAllWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware

        const result = await wishlistService.getAllWishlistBooks(userId);
        
        return res.status(200).json({
            status: "Success",
            data: result.data,
            message: result.message,
        });
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Handler for GET /get-recent-wishlist
const getRecentWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware

        const result = await wishlistService.getRecentWishlistBooks(userId, 3);
        
        return res.status(200).json({
            status: "Success",
            data: result.data,
            message: result.message,
        });
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getAllWishlist,
    getRecentWishlist,
};