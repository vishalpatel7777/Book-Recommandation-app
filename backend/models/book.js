const mongoose = require("mongoose");

// book database schema

const book = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("books", book);
