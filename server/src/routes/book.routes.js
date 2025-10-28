const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { uploadPdf } = require("../middleware/upload.middleware"); // Import PDF upload middleware

// --- ADMIN ROUTES (Protected by authenticateToken and assumed role check in controller) ---
router.post("/add-book", authenticateToken, uploadPdf, bookController.addBook);
router.put("/update-book/:id", authenticateToken, uploadPdf, bookController.updateBook);
router.delete("/delete-book", authenticateToken, bookController.deleteBook);

// --- PUBLIC/USER ROUTES ---
router.get("/get-all-books", bookController.getAllBooks);
router.get("/get-recent-books", bookController.getRecentBooks);
router.get("/get-book-by-id/:id", bookController.getBookById);
router.get("/get-all-books-search", bookController.searchBooks);
router.get("/book-stats", bookController.getBookStats); // Assuming these are public stats

// --- Rating & Review Routes (Requires authentication) ---
router.post("/store-rating", authenticateToken, bookController.addRating);
router.post("/store-review", authenticateToken, bookController.addReview);
router.get("/get-rating/:userId/:bookId", bookController.getRating); // Can be public or authenticated, keeping public for now
router.get("/get-review/:userId/:bookId", bookController.getReview); // Can be public or authenticated, keeping public for now

// --- Recommendation Route (Public) ---
router.get("/get-recommended-books", bookController.getRecommendedBooks);

module.exports = router;