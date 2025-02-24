// steel working on this

const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("../routes/userAuth");

// Add Notification
router.put("/add-notification", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);

    const newNotification = {
      book: bookid,
      read: false,
      rating: null,
    };

    await User.findByIdAndUpdate(id, {
      $push: { notifications: newNotification },
    });
    res.status(200).json({ message: "Notification added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add or Update Rating
router.put("/rate-book", authenticateToken, async (req, res) => {
  try {
    const { bookid, id, rating } = req.headers;
    await User.updateOne(
      { _id: id, "notifications.book": bookid },
      { $set: { "notifications.$.rating": rating } }
    );

    await Book.findByIdAndUpdate(bookid, { $push: { ratings: rating } });

    res.status(200).json({ message: "Rating added/updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Average Rating for a Book
router.get("/average-rating", async (req, res) => {
  try {
    const { bookid } = req.headers;

    const bookData = await Book.findById(bookid);
    if (!bookData || !bookData.ratings.length) {
      return res
        .status(200)
        .json({ message: "No ratings available", averageRating: 0 });
    }

    const totalRatings = bookData.ratings.reduce(
      (sum, rating) => sum + rating,
      0
    );
    const avgRating = totalRatings / bookData.ratings.length;

    res.status(200).json({ averageRating: avgRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Notifications for a User
router.get("/get-notifications", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("notifications.book");

    const notifications = userData.notifications;
    if (notifications.length === 0) {
      return res.status(200).json({ message: "No notifications available" });
    }

    res.status(200).json({
      status: "Success",
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
