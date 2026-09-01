const bookService = require("../services/book.service");
const fs = require("fs");
const path = require("path");
const {
  RECENT_BOOKS_LIMIT,
  RECOMMENDED_BOOKS_LIMIT,
} = require("../config/constants");
const { UPLOAD_DIR } = require("../config/paths");
const asyncHandler = require("../utils/asyncHandler");

const requireAdmin = (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Access denied: Admin only" });
        return false;
    }
    return true;
};

// --- Admin Book Management Handlers ---

const addBook = asyncHandler(async (req, res, next) => {
    if (!requireAdmin(req, res)) return;

    const { title, author, price } = req.body || {};
    if (!title || !author || !price || !req.file) {
        if (req.file) fs.unlinkSync(path.join(UPLOAD_DIR, req.file.filename));
        return res.status(400).json({ message: "Title, author, price, and PDF are required" });
    }

    const fullPath = path.join(UPLOAD_DIR, req.file.filename);
    const newBook = await bookService.createBook(req.body, fullPath, req.file.filename);
    const bookWithRatings = await bookService.getBookById(newBook._id);

    return res.status(201).json({
        message: "Book added successfully",
        data: bookWithRatings || {},
    });
});

const updateBook = asyncHandler(async (req, res) => {
    if (!requireAdmin(req, res)) return;

    const bookId = req.params.id;
    const updatedBook = await bookService.updateBook(bookId, req.body, req.file);
    const bookWithRatings = await bookService.getBookById(updatedBook._id);

    return res.status(200).json({
        message: "Book updated successfully",
        data: bookWithRatings || {},
    });
});

const deleteBook = asyncHandler(async (req, res, next) => {
    if (!requireAdmin(req, res)) return;

    const { bookid } = req.headers;
    try {
        await bookService.deleteBook(bookid);
    } catch (error) {
        if (error.message.includes("Book not found")) {
            return res.status(404).json({ message: error.message });
        }
        throw error;
    }
    return res.status(200).json({ message: "Book deleted successfully" });
});

// --- User Book Retrieval Handlers ---

const getAllBooks = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const parsedPage  = page  ? Math.max(1, parseInt(page, 10))  : null;
        const parsedLimit = limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : null;
        const result = await bookService.getAllBooks(parsedPage, parsedLimit);
        if (parsedPage && parsedLimit && result.pagination) {
            return res.status(200).json({ status: "success", ...result });
        }
        return res.status(200).json({ status: "success", data: result });
    } catch (error) {
        next(error);
    }
};

const getRecentBooks = async (req, res, next) => {
    try {
        const books = await bookService.getRecentBooks(RECENT_BOOKS_LIMIT);
        return res.status(200).json({ status: "success", data: books });
    } catch (error) {
        next(error);
    }
};

const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await bookService.getBookById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({ status: "success", data: book });
    } catch (error) {
        next(error);
    }
};

const searchBooks = async (req, res, next) => {
    try {
        const { search } = req.query;
        const books = await bookService.searchBooks(search);
        // fire-and-forget analytics (admin-only concern, never throws)
        try {
          const cmsService = require("../services/cms.service");
          const len = Array.isArray(books) ? books.length : (books?.data?.length ?? 0);
          if (search) cmsService.logSearch(search, req.user?.id || null, len);
        } catch (_) {}
        return res.status(200).json({ status: "success", data: books });
    } catch (error) {
        next(error);
    }
};

const getBookStats = async (req, res, next) => {
    try {
        const stats = await bookService.getBookStats();
        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

const filterBooksByGenre = async (req, res, next) => {
    try {
        const { genres, limit } = req.query || {};

        if (!genres) {
            return res.status(400).json({ message: "Genres parameter is required" });
        }

        const genreArray = genres.split(",").map((genre) => genre.trim());
        const result = await bookService.getBooksByGenres(genreArray, limit);

        if (result.data.length === 0) {
            return res.status(404).json({ message: result.message, data: [] });
        }

        return res.json({ status: "success", data: result.data });
    } catch (error) {
        next(error);
    }
};

// --- Rating & Review ---

const addRating = async (req, res, next) => {
    try {
        const { book, rate, user } = req.body || {};
        if (!book || !rate || !user) {
            return res.status(400).json({ error: "Book ID, rating, and user ID are required" });
        }
        const result = await bookService.storeRating(book, rate, user);
        res.status(201).json(result);
    } catch (error) {
        if (error.message.includes("already rated")) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

const addReview = async (req, res, next) => {
    try {
        const { userId, bookId, rating, review } = req.body || {};
        const result = await bookService.storeReview(userId, bookId, rating, review);
        res.status(201).json(result);
    } catch (error) {
        if (error.message.includes("already reviewed") || error.message.includes("Missing required review fields")) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

const getRating = async (req, res, next) => {
    try {
        const { userId, bookId } = req.params;
        const rating = await bookService.getRatingByBookAndUser(userId, bookId);
        if (!rating) return res.status(404).json({});
        res.json(rating);
    } catch (error) {
        next(error);
    }
};

const getReview = async (req, res, next) => {
    try {
        const { userId, bookId } = req.params;
        const review = await bookService.getReviewByBookAndUser(userId, bookId);
        if (!review) return res.status(404).json({});
        res.json(review);
    } catch (error) {
        next(error);
    }
};

const getReviewsByBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const reviews = await bookService.getReviewsByBook(bookId);
        res.json({ data: reviews });
    } catch (error) {
        next(error);
    }
};

// --- Recommendation ---

const getRecommendedBooks = async (req, res, next) => {
    try {
        const recommendedBooks = await bookService.fetchRecommendedBooks(RECOMMENDED_BOOKS_LIMIT);
        res.status(200).json({ data: recommendedBooks });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addBook,
    updateBook,
    deleteBook,
    getAllBooks,
    getRecentBooks,
    getBookById,
    searchBooks,
    getBookStats,
    filterBooksByGenre,
    addRating,
    addReview,
    getRating,
    getReview,
    getReviewsByBook,
    getRecommendedBooks,
};