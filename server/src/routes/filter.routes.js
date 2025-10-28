const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller"); // Use bookController for filtering

// This route is public
router.get("/get-books-by-genre", bookController.filterBooksByGenre);

module.exports = router;