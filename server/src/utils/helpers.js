const Rating = require("../models/rating.model"); // <-- FIXED model import path

// Function to add ratings to books (expects Mongoose documents/objects)
const addRatingsToBooks = async (books) => {
    if (!books || books.length === 0) return [];

    const bookIds = books.map(book => book._id);

    const ratings = await Rating.aggregate([
        { $match: { book: { $in: bookIds } } }, // Only match books being processed
        {
            $group: {
                _id: "$book",
                averageRating: { $avg: "$rate" },
            },
        },
    ]);

    const ratingsMap = ratings.reduce((acc, { _id, averageRating }) => {
        acc[_id.toString()] = Number(averageRating.toFixed(1)) || 0;
        return acc;
    }, {});

    return books.map((book) => {
        const bookObject = book.toObject ? book.toObject() : book;
        const avgRating = ratingsMap[bookObject._id.toString()] || 0;
        return {
            ...bookObject,
            ratings: avgRating,
        };
    });
};

module.exports = {
    addRatingsToBooks
};