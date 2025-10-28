const User = require("../models/user.model");
const { addRatingsToBooks } = require("../utils/helpers");

const addBookToWishlist = async (userId, bookId) => {
    const userData = await User.findById(userId);
    if (!userData) {
        throw new Error("User not found");
    }

    const isbookWishlist = userData.wishlist.map(id => id.toString()).includes(bookId);
    if (isbookWishlist) {
        // Return 200/409 status as an object, controlled by the controller
        return { message: "book is already in wishlist", status: 409 }; 
    }

    await User.findByIdAndUpdate(userId, { $push: { wishlist: bookId } });
    return { message: "book added to wishlist", status: 200 };
};

const removeBookFromWishlist = async (userId, bookId) => {
    const userData = await User.findById(userId);
    if (!userData) {
        throw new Error("User not found");
    }

    const isbookWishlist = userData.wishlist.map(id => id.toString()).includes(bookId);
    if (!isbookWishlist) {
        return { message: "book not available in the wishlist", status: 404 };
    }

    await User.findByIdAndUpdate(userId, { $pull: { wishlist: bookId } });
    return { message: "book removed from wishlist", status: 200 };
};

const getAllWishlistBooks = async (userId) => {
    const userData = await User.findById(userId).populate("wishlist");
    if (!userData) {
        throw new Error("User not found");
    }

    const wishlist = userData.wishlist || [];
    if (wishlist.length === 0) {
        return { message: "No books in wishlist", data: [] };
    }

    const wishlistWithRatings = await addRatingsToBooks(wishlist);
    return { data: wishlistWithRatings };
};

const getRecentWishlistBooks = async (userId, limit = 3) => {
    const userData = await User.findById(userId).populate("wishlist");
    if (!userData) {
        throw new Error("User not found");
    }

    const wishlist = userData.wishlist || [];
    if (wishlist.length === 0) {
        return { message: "No books in wishlist", data: [] };
    }

    // Get the last 'limit' books in the array
    const recentBooks = wishlist.slice(-limit); 
    const recentBooksWithRatings = await addRatingsToBooks(recentBooks);

    return { data: recentBooksWithRatings };
};

module.exports = {
    addBookToWishlist,
    removeBookFromWishlist,
    getAllWishlistBooks,
    getRecentWishlistBooks,
};