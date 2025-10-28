const Book = require("../models/book.model");
const Purchase = require("../models/purchase.model");
const Order = require("../models/order.model");
const { addRatingsToBooks } = require("../utils/helpers");
const { uploadToGoogleDrive, cleanupLocalFile } = require("../utils/s3Helper"); // Google Drive helper
const Review = require("../models/review.model");
const Rating = require("../models/rating.model");
// --- CRUD Operations ---

const createBook = async (bookData, tempFilePath, tempFileName) => {
    const pdfUrl = await uploadToGoogleDrive(tempFilePath, tempFileName);
    cleanupLocalFile(tempFilePath); // Clean up temp file immediately

    const book = new Book({
        ...bookData,
        pdf: pdfUrl,
    });
    await book.save();
    return book;
};

const updateBook = async (bookId, updateData, tempFile) => {
    // If a new PDF file is uploaded, handle it
    if (tempFile) {
        const fullPath = path.join(os.tmpdir(), tempFile.filename);
        const pdfUrl = await uploadToGoogleDrive(fullPath, tempFile.filename);
        cleanupLocalFile(fullPath);
        updateData.pdf = pdfUrl;
    }

    const book = await Book.findByIdAndUpdate(bookId, updateData, { new: true });
    if (!book) {
        throw new Error("Book not found");
    }
    return book;
};

const deleteBook = async (bookId) => {
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
        throw new Error("Book not found");
    }
    // OPTIONAL: Implement logic here to delete the PDF from Google Drive
    return book;
};

// --- Retrieval Operations ---

const getAllBooks = async () => {
    const books = await Book.find().sort({ createdAt: -1 });
    return await addRatingsToBooks(books);
};

const getRecentBooks = async (limit = 4) => {
    const books = await Book.find().sort({ createdAt: -1 }).limit(limit);
    return await addRatingsToBooks(books);
};

const getBookById = async (id) => {
    const book = await Book.findById(id);
    if (!book) {
        return null;
    }
    const bookWithRatings = await addRatingsToBooks([book]);
    return bookWithRatings[0];
};

const searchBooks = async (searchQuery) => {
    let query = {};
    if (searchQuery) {
        query = {
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { author: { $regex: searchQuery, $options: "i" } },
            ],
        };
    }
    const books = await Book.find(query).sort({ createdAt: -1 });
    return await addRatingsToBooks(books);
};

const getBookStats = async () => {
    // Note: Top rated books should be calculated by aggregation, but for simplicity, using the current logic:
    const topRatedBooks = await Book.find().sort({ ratings: -1 }).limit(5); 
    const trendingBooks = await Book.find().sort({ createdAt: -1 }).limit(5);

    const mostPurchasedBooks = await Order.aggregate([
        { $unwind: "$books" },
        { $group: { _id: "$books", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
        { $unwind: "$book" },
    ]);

    return { topRatedBooks, trendingBooks, mostPurchasedBooks };
};


const getBooksByGenres = async (genres, limit = 10) => {
    if (!genres || genres.length === 0) {
        throw new Error("Genres parameter is required");
    }

    // Create an array of case-insensitive regular expressions for $in query
    const regexArray = genres.map((g) => new RegExp(g, "i"));

    const books = await Book.find({
        genre: { $in: regexArray }
    })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit) || 10);

    if (!books || books.length === 0) {
        return { message: "No books found for these genres", data: [] };
    }

    const booksWithRatings = await addRatingsToBooks(books);
    return { data: booksWithRatings };
};


// --- Rating & Review Services ---

const storeRating = async (bookId, rate, userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
        throw new Error("Invalid user or book ID");
    }
    
    // Check if user has already rated
    const existingRating = await Rating.findOne({ user: userId, book: bookId });
    if (existingRating) {
        throw new Error("You have already rated this book.");
    }
    
    const rating = new Rating({ book: bookId, rate, user: userId });
    await rating.save();
    return { message: "Rating submitted successfully" };
};

const storeReview = async (userId, bookId, rating, reviewText) => {
    if (!userId || !bookId || !reviewText.trim()) {
        throw new Error("Missing required review fields");
    }

    const existingReview = await Review.findOne({ userId, bookId });
    if (existingReview) {
        throw new Error("You have already reviewed this book.");
    }

    const newReview = new Review({ userId, bookId, rating: rating || 0, review: reviewText });
    await newReview.save();
    return { message: "Review submitted successfully" };
};

const getRatingByBookAndUser = async (userId, bookId) => {
    const rating = await Rating.findOne({ user: userId, book: bookId });
    return rating;
};

const getReviewByBookAndUser = async (userId, bookId) => {
    const review = await Review.findOne({ userId, bookId });
    return review;
};

// --- Recommendation Service ---

const fetchRecommendedBooks = async (limit = 4) => {
    const ratings = await Rating.find().populate("user book");
    const validRatings = ratings.filter((r) => r.user && r.book);

    // Fallback: If no ratings, return recent books
    if (!validRatings.length) {
        const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(limit);
        return await addRatingsToBooks(recentBooks);
    }

    // Main logic: Aggregate average ratings
    const ratedBookStats = await Rating.aggregate([
        { $group: {
            _id: "$book",
            avgRating: { $avg: "$rate" },
            latestRating: { $max: "$createdAt" },
        }},
        { $sort: { avgRating: -1, latestRating: -1 } },
    ]);

    const ratedBookIds = ratedBookStats.map((stat) => stat._id);
    let ratedBooks = await Book.find({ _id: { $in: ratedBookIds } });
    ratedBooks = await addRatingsToBooks(ratedBooks); // Add current average ratings

    let recommendedBooks = ratedBooks.map(book => {
        const stat = ratedBookStats.find(s => s._id.toString() === book._id.toString());
        return { ...book, avgRating: stat ? stat.avgRating : 0 };
    }).sort((a, b) => b.avgRating - a.avgRating);
    
    // Fill with recent books if needed
    const numRatedBooks = recommendedBooks.length;
    if (numRatedBooks < limit) {
        const remaining = limit - numRatedBooks;
        const recentBooks = await Book.find({
            _id: { $nin: ratedBookIds },
        }).sort({ createdAt: -1 }).limit(remaining);

        const recentBooksWithRatings = await addRatingsToBooks(recentBooks);
        recommendedBooks = [...recommendedBooks, ...recentBooksWithRatings];
    }
    
    return recommendedBooks.slice(0, limit);
};



module.exports = {
    createBook,
    updateBook,
    deleteBook,
    getAllBooks,
    getRecentBooks,
    getBookById,
    searchBooks,
    getBookStats,
    getBooksByGenres,
    storeRating,
    storeReview,
    getRatingByBookAndUser,
    getReviewByBookAndUser,
    fetchRecommendedBooks,
};