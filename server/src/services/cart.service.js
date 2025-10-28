const User = require("../models/user.model");
const { addRatingsToBooks } = require("../utils/helpers");

const addBookToCart = async (userId, bookId) => {
    const userData = await User.findById(userId);
    if (!userData) {
        throw new Error("User not found");
    }

    const isBookInCart = userData.cart.includes(bookId);
    if (isBookInCart) {
        return { message: "book is already in Cart", status: 200 };
    }

    await User.findByIdAndUpdate(userId, { $push: { cart: bookId } });
    return { message: "book added to Cart", status: 200 };
};

const removeBookFromCart = async (userId, bookId) => {
    const userData = await User.findById(userId);
    if (!userData) {
        throw new Error("User not found");
    }

    const isBookInCart = userData.cart.includes(bookId);
    if (!isBookInCart) {
        return { message: "book not available in the Cart", status: 200 };
    }

    await User.findByIdAndUpdate(userId, { $pull: { cart: bookId } });
    return { message: "book removed from Cart", status: 200 };
};

const clearUserCart = async (userId) => {
    const userData = await User.findById(userId);
    if (!userData) {
        throw new Error("User not found");
    }

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    return { message: "Cart cleared" };
};

const getUserCart = async (userId) => {
    const userData = await User.findById(userId).populate("cart");
    if (!userData) {
        throw new Error("User not found");
    }

    const cart = userData.cart || [];
    if (cart.length === 0) {
        return { message: "No books in cart", data: [] };
    }

    const cartWithRatings = await addRatingsToBooks(cart);
    return { data: cartWithRatings };
};

module.exports = {
    addBookToCart,
    removeBookFromCart,
    clearUserCart,
    getUserCart,
};