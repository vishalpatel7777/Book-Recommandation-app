const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("../routes/userAuth");

// wishlist

// add book to wishlist api
router.put("/add-to-wishlist", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookWishlist = userData.wishlist.includes(bookid);
    if (isBookWishlist) {
      return res.status(200).json({ message: "Book is already in wishlist" });
    }
    await User.findByIdAndUpdate(id, { $push: { wishlist: bookid } });
    res.status(200).json({ message: "Book added to in wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete book from wishlist
router.put(
  "/remove-book-from-wishlist",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isBookWishlist = userData.wishlist.includes(bookid);
      if (isBookWishlist) {
        await User.findByIdAndUpdate(id, { $pull: { wishlist: bookid } });
        res.status(200).json({ message: "Book removed from wishlist" });
      }

      res.status(200).json({ message: "Book not available in the wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// get-all-wishlist books
router.get("/get-all-wishlist", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("wishlist");
    const wishlist = userData.wishlist;
    if (wishlist.length === 0) {
      res.status(200).json({ message: "No books in wishlist" });
    }
    res.status(200).json({
      status: "Success",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
