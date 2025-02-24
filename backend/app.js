const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");
const user = require("./routes/user");
const book = require("./routes/book");
const wishlist = require("./routes/wishlist");
const Cart = require("./routes/cart");
const Notification = require("./routes/notification");
const Filter = require("./routes/filter");

app.use(cors());
app.use(express.json());
// routes
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", wishlist);
app.use("/api/v1", Cart);
app.use("/api/v1", Notification);
app.use("/api/v1", Filter);

// creating  port
app.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});
