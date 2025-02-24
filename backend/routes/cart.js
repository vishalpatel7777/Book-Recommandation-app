const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("../routes/userAuth");

//add to cart api

// add to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart) {
      return res.status(200).json({ message: "Book is already in Cart" });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    res.status(200).json({ message: "Book added to Cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//remove from cart

router.put("/remove-book-from-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart) {
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      res.status(200).json({ message: "Book removed from Cart" });
    }

    res.status(200).json({ message: "Book not available in the Cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get cart for perticular user  api
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart;
    if (cart.length === 0) {
      res.status(200).json({ message: "No books in cart" });
    }
    res.status(200).json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
