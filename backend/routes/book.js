const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../routes/userAuth");

// books apis

// add book  --admin

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You are not authorized to add book" });
    }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      subject: req.body.subject,
      genre: req.body.genre,
      desc: req.body.desc,
      price: req.body.price,
      language: req.body.language,
      image: req.body.image,
    });
    await book.save();
    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

// update book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      subject: req.body.subject,
      genre: req.body.genre,
      desc: req.body.desc,
      price: req.body.price,
      language: req.body.language,
      image: req.body.image,
    });
    return res.status(200).json({ message: "  Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

// delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({ message: " Book deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

// get-all-books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "success",
      data: books,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// get recently added books
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "success",
      data: books,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// get book by id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "success",
      data: book,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

module.exports = router;
