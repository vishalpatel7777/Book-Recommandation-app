const cartService = require("../services/cart.service");

// Handler for PUT /add-to-cart
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        const { bookid } = req.headers || {};

        if (!bookid) {
            return res.status(400).json({ message: "Missing bookid" });
        }

        const result = await cartService.addBookToCart(userId, bookid);
        
        return res.status(200).json({ message: result.message });
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Handler for PUT /remove-book-from-cart (using headers)
const removeFromCartByHeader = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        const { bookid } = req.headers || {};

        if (!bookid) {
            return res.status(400).json({ message: "Missing bookid" });
        }

        const result = await cartService.removeBookFromCart(userId, bookid);
        
        return res.status(200).json({ message: result.message });
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Handler for PUT /remove-book-from-cart/:bookid (using params)
const removeFromCartByParam = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        const { bookid } = req.params || {};
        
        if (!bookid) {
            return res.status(400).json({ message: "Missing bookid" });
        }

        const result = await cartService.removeBookFromCart(userId, bookid);
        
        return res.json({ status: "Success", message: result.message });
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Handler for POST /clear-cart
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        
        const result = await cartService.clearUserCart(userId);
        
        res.status(200).json({ message: result.message });
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Handler for GET /get-user-cart
const getUserCart = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        
        const result = await cartService.getUserCart(userId);
        
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
    addToCart,
    removeFromCartByHeader,
    removeFromCartByParam,
    clearCart,
    getUserCart,
};