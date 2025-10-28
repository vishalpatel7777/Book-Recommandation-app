const User = require("../models/user.model");
const Book = require("../models/book.model");
const Review = require("../models/review.model");
const Rating = require("../models/rating.model");
const Purchase = require("../models/purchase.model");
const bcrypt = require("bcryptjs"); // <--- Imported for manual hashing

// Service to get profile data, excluding sensitive fields
const fetchAdminProfile = async (adminId) => {
  const user = await User.findById(adminId).select("-password");
  return user;
};

// Service to update profile data (including optional password change)
const updateAdminProfile = async (adminId, updateData, oldPassword) => {
  const existingAdmin = await User.findById(adminId);
  if (!existingAdmin) {
    throw new Error("Admin not found");
  }

  // Handle password change logic
  if (oldPassword && updateData.password) {
    // Use the instance method defined on the model
    const isMatch = await existingAdmin.comparePassword(oldPassword); 
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    
    // CRITICAL FIX: Manually hash the new password for findByIdAndUpdate
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    updateData.password = hashedPassword;
  }
  
  // NOTE: When using findByIdAndUpdate, the Mongoose pre('save') hook is bypassed.
  const updatedAdmin = await User.findByIdAndUpdate(adminId, updateData, {
    new: true,
  }).select("-password");

  if (!updatedAdmin) {
    throw new Error("Update failed");
  }

  return updatedAdmin;
};

// ... (Rest of admin.service.js content remains the same)

// Service to fetch general daily stats
const fetchDailyStats = async () => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({
    lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  const totalPurchases = await Purchase.countDocuments();
  const totalReviews = await Review.countDocuments();

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    totalPurchases: totalPurchases || 0,
    totalReviews: totalReviews || 0,
  };
};

// Service to fetch user activity list
const fetchUserActivity = async () => {
  const users = await User.find({}, "username email lastLogin role").sort({
    lastLogin: -1,
  });
  return users;
};

// Service to fetch detailed book analytics
const fetchBookAnalytics = async () => {
  const totalBooks = await Book.countDocuments();

  // Top Rated Books Aggregation
  const topRatedBooks = await Rating.aggregate([
    { $group: { _id: "$book", ratings: { $avg: "$rate" } } }, 
    { $sort: { ratings: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "books", 
        localField: "_id",
        foreignField: "_id",
        as: "bookData",
      },
    },
    { $unwind: "$bookData" },
    { $project: { title: "$bookData.title", ratings: 1 } },
  ]);

  // Most Purchased Books Aggregation
  const mostPurchasedBooks = await Purchase.aggregate([
    { $group: { _id: "$book", purchases: { $sum: 1 } } },
    { $sort: { purchases: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "books", 
        localField: "_id",
        foreignField: "_id",
        as: "bookData",
      },
    },
    { $unwind: "$bookData" },
    { $project: { title: "$bookData.title", purchases: 1 } },
  ]);

  const recentBooks = await Book.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title createdAt");

  return {
    totalBooks: totalBooks || 0,
    topRatedBooks: topRatedBooks || [],
    mostPurchasedBooks: mostPurchasedBooks || [],
    recentBooks: recentBooks || [],
  };
};

// Service to fetch monthly statistics
const fetchMonthlyAnalytics = async () => {
  const userStats = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);

  const revenueStats = await Purchase.aggregate([
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "bookData",
      },
    },
    { $unwind: "$bookData" },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalRevenue: { $sum: { $ifNull: ["$bookData.price", 0] } },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);

  const topGenres = await Book.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  return {
    userStats: userStats.length ? userStats : [],
    revenueStats: revenueStats.length ? revenueStats : [],
    topGenres: topGenres.length ? topGenres : [],
  };
};


module.exports = {
  fetchAdminProfile,
  updateAdminProfile,
  fetchDailyStats,
  fetchUserActivity,
  fetchBookAnalytics,
  fetchMonthlyAnalytics,
};