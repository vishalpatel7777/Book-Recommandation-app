// user schemas
const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      default:
        "https://www.bing.com/th?id=OIP.S_BEyoTYNIwRpRXmQWtKJAHaHa&w=198&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    },
    avatar: {
      type: String,
      default:
        "https://www.bing.com/th?id=OIP.S_BEyoTYNIwRpRXmQWtKJAHaHa&w=198&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],
    // steel working on this
    notifications: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        read: { type: Boolean, default: false },
        rating: { type: Number, min: 1, max: 5, default: null },
      },
    ],

    order: [
      {
        type: mongoose.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", user);
