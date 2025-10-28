const bookService = require("../services/book.service");
const User = require("../models/user.model"); // Needed for admin check
const path = require("path");
const os = require("os");

// --- Admin Book Management Handlers ---

const addBook = async (req, res, next) => {
    try {
        const userId = req.headers.id; 
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }

        const { title, author, price } = req.body || {};
        if (!title || !author || !price || !req.file) {
            // Cleanup temp file on failure before returning
            if (req.file) {
                const fullPath = path.join(os.tmpdir(), req.file.filename);
                fs.unlinkSync(fullPath);
            }
            return res.status(400).json({ message: "Title, author, price, and PDF are required" });
        }
        
        const fullPath = path.join(os.tmpdir(), req.file.filename);
        
        // Pass file details and book data to service
        const newBook = await bookService.createBook(req.body, fullPath, req.file.filename);
        
        // Since the service returns the raw book, we need to add ratings for the response
        const bookWithRatings = await bookService.getBookById(newBook._id); 
        
        return res.status(201).json({
            message: "Book added successfully",
            data: bookWithRatings || {},
        });
    } catch (error) {
        next(error);
    }
};

const updateBook = async (req, res, next) => {
    try {
        const userId = req.headers.id;
        const bookId = req.params.id;
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }

        // Pass book ID, update body, and file object to service
        const updatedBook = await bookService.updateBook(bookId, req.body, req.file);
        
        const bookWithRatings = await bookService.getBookById(updatedBook._id);
        
        return res.status(200).json({
            message: "Book updated successfully",
            data: bookWithRatings || {},
        });
    } catch (error) {
        next(error);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const { id: userId, bookid } = req.headers;
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        
        await bookService.deleteBook(bookid);

        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        if (error.message.includes("Book not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// --- User Book Retrieval Handlers ---

const getAllBooks = async (req, res, next) => {
    try {
        const books = await bookService.getAllBooks();
        return res.status(200).json({ status: "success", data: books });
    } catch (error) {
        next(error);
    }
};

const getRecentBooks = async (req, res, next) => {
    try {
        const books = await bookService.getRecentBooks(4);
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


// Handler for GET /get-books-by-genre
const filterBooksByGenre = async (req, res, next) => {
    try {
        const { genres, limit } = req.query || {};

        if (!genres) {
            return res.status(400).json({ message: "Genres parameter is required" });
        }
        
        // Convert comma-separated string to array
        const genreArray = genres.split(",").map((genre) => genre.trim());

        const result = await bookService.getBooksByGenres(genreArray, limit);

        if (result.data.length === 0) {
            return res.status(404).json({ message: result.message, data: [] });
        }

        return res.json({
            status: "success",
            data: result.data,
        });
    } catch (error) {
        if (error.message.includes("Genres parameter is required")) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};


// --- New Handlers for Rating/Review ---

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
        if (error.message.includes("already reviewed")) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message.includes("Missing required review fields")) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

const getRating = async (req, res, next) => {
    try {
        const { userId, bookId } = req.params;
        const rating = await bookService.getRatingByBookAndUser(userId, bookId);
        if (!rating) {
            return res.status(404).json({}); // Return 404 if not found
        }
        res.json(rating);
    } catch (error) {
        next(error);
    }
};

const getReview = async (req, res, next) => {
    try {
        const { userId, bookId } = req.params;
        const review = await bookService.getReviewByBookAndUser(userId, bookId);
        if (!review) {
            return res.status(404).json({}); // Return 404 if not found
        }
        res.json(review);
    } catch (error) {
        next(error);
    }
};

// --- Recommendation Handler ---

const getRecommendedBooks = async (req, res, next) => {
    try {
        // userId can be taken from req.user if authenticated, but here it's public
        const recommendedBooks = await bookService.fetchRecommendedBooks(4);
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
    getRecommendedBooks,  
};