const User = require("../models/user.model");
const Book = require("../models/book.model");
const Author = require("../models/author.model");
const Order = require("../models/order.model");
const { generateAuthToken } = require("./auth.service");

async function registerAuthor(data) {
  const { email, username, password, fullname, phone, age, genre, penName, bio } = data;
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new Error(existing.username === username ? "Username already exists" : "Email already exists");

  const authorDoc = await Author.create({
    name: penName || fullname || username,
    genre: genre || "",
    bio: bio || "",
    status: "active",
  });

  const user = new User({
    username, email, password, fullname, phone, age, genre,
    role: "author",
    isVerified: true, // authors verified by admin flow or auto
    authorProfile: { penName: penName || fullname, bio: bio || "", authorId: authorDoc._id },
  });
  await user.save();

  // also set booksCount 0
  return { message: "Author registered successfully. You can now log in.", authorId: authorDoc._id, userId: user._id };
}

async function getAuthorDashboard(userId) {
  const user = await User.findById(userId).select("-password");
  if (!user || user.role !== "author") throw new Error("Author not found");
  const authorId = user.authorProfile?.authorId;
  const penName = user.authorProfile?.penName || user.username;

  // Books by this author (match author string or genre)
  const books = await Book.find({ author: penName }).sort({ createdAt: -1 }).lean();
  // Also try to find by author field containing penName
  const allAuthorBooks = books.length ? books : await Book.find({ author: { $regex: penName, $options: "i" } }).lean();

  const totalBooks = allAuthorBooks.length;
  const totalSales = await Order.countDocuments({ books: { $in: allAuthorBooks.map(b => b._id) } });

  // Recent orders containing author's books
  let recentOrders = [];
  if (allAuthorBooks.length) {
    recentOrders = await Order.find({ books: { $in: allAuthorBooks.map(b => b._id) } })
      .sort({ createdAt: -1 }).limit(5)
      .populate("user", "username email").lean();
  }

  const authorDoc = authorId ? await Author.findById(authorId).lean() : null;

  return {
    profile: {
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      penName: user.authorProfile?.penName,
      bio: user.authorProfile?.bio,
      verified: user.authorProfile?.verified || false,
      authorDoc,
    },
    stats: { totalBooks, totalSales, penName },
    books: allAuthorBooks,
    recentOrders,
  };
}

async function updateAuthorProfile(userId, updates) {
  const allowed = ["penName", "bio", "fullname", "phone", "genre"];
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "author") throw new Error("Not an author account");

  if (updates.penName !== undefined) user.authorProfile.penName = updates.penName;
  if (updates.bio !== undefined) user.authorProfile.bio = updates.bio;
  if (updates.fullname !== undefined) user.fullname = updates.fullname;
  if (updates.phone !== undefined) user.phone = updates.phone;
  if (updates.genre !== undefined) user.genre = updates.genre;
  await user.save();

  // sync to Author collection
  if (user.authorProfile?.authorId) {
    await Author.findByIdAndUpdate(user.authorProfile.authorId, {
      name: user.authorProfile.penName || user.fullname,
      bio: user.authorProfile.bio,
      genre: user.genre,
    });
  }

  return user;
}

async function getAuthorBooks(userId) {
  const user = await User.findById(userId);
  if (!user || user.role !== "author") throw new Error("Author not found");
  const penName = user.authorProfile?.penName || user.fullname || user.username;
  const books = await Book.find({ author: { $regex: `^${penName}$`, $options: "i" } }).sort({ createdAt: -1 });
  // fallback: broader regex
  if (!books.length) {
    return Book.find({ author: { $regex: penName, $options: "i" } }).sort({ createdAt: -1 });
  }
  return books;
}

module.exports = { registerAuthor, getAuthorDashboard, updateAuthorProfile, getAuthorBooks };
