const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// filter for genre
router.get("/get-books-by-genre", async (req, res) => {
  const { genre, limit = 10 } = req.query;

  try {
    const books = await Book.find({ genre: { $regex: genre, $options: "i" } })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return res.json({
      status: "success",
      data: books,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
