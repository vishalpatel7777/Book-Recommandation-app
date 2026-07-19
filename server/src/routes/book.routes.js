const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { uploadPdf } = require("../middleware/upload.middleware");
const { validate, validateParams, validateQuery } = require("../middleware/validate.middleware");
const {
  storeRatingSchema,
  storeReviewSchema,
  objectIdParamSchema,
  bookIdParamSchema,
  searchQuerySchema,
} = require("../validators/book.validator");

// --- ADMIN ROUTES ---
router.post("/add-book",          authenticateToken, uploadPdf, bookController.addBook);
router.put("/update-book/:id",    authenticateToken, uploadPdf, validateParams(objectIdParamSchema), bookController.updateBook);
router.delete("/delete-book",     authenticateToken, bookController.deleteBook);

// --- PUBLIC/USER ROUTES ---
router.get("/get-all-books",         bookController.getAllBooks);
router.get("/get-recent-books",      bookController.getRecentBooks);
router.get("/get-book-by-id/:id",    validateParams(objectIdParamSchema), bookController.getBookById);
router.get("/get-all-books-search",  validateQuery(searchQuerySchema), bookController.searchBooks);
router.get("/book-stats",            bookController.getBookStats);
router.get("/get-recommended-books", bookController.getRecommendedBooks);

// --- Rating & Review ---
router.post("/store-rating", authenticateToken, validate(storeRatingSchema), bookController.addRating);
router.post("/store-review", authenticateToken, validate(storeReviewSchema), bookController.addReview);
router.get("/get-rating/:userId/:bookId", bookController.getRating);
router.get("/get-review/:userId/:bookId", bookController.getReview);
router.get("/get-reviews/:bookId",        validateParams(bookIdParamSchema), bookController.getReviewsByBook);

module.exports = router;
