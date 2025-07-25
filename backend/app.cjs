const express = require("express");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");
require("./conn/conn");

const app = express();
const user = require("./routes/user");
const book = require("./routes/book");
const wishlist = require("./routes/wishlist");
const Cart = require("./routes/cart");
const Notification = require("./routes/notification");
const Filter = require("./routes/filter");
const adminRoutes = require("./routes/adminRoutes");
const payment = require("./routes/payment");
const order = require("./routes/order");

const path = require("path");


app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", wishlist);
app.use("/api/v1", Cart);
app.use("/api/v1", Notification);
app.use("/api/v1", Filter);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", payment);
app.use("/api/v1", order);

app.use("/uploads", (req, res, next) => {
  console.log("Requesting:", req.path);
  next();
}, express.static("/tmp")); // Serve from /tmp

console.log("Checking /uploads at startup:", fs.existsSync("/uploads"));
console.log("Checking /tmp at startup:", fs.existsSync("/tmp"));
console.log("Root dir contents:", fs.readdirSync("/").join(", "));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});