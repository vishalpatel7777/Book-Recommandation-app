const adminService = require("../services/admin.service");
const asyncHandler = require("../utils/asyncHandler");

// Handler for GET /get-admin-profile
const getAdminProfile = asyncHandler(async (req, res) => {
  const adminId = req.user.id;

  if (req.headers.id && req.headers.id !== adminId) {
    return res.status(403).json({ message: "Token and client ID mismatch" });
  }

  const user = await adminService.fetchAdminProfile(adminId);

  if (!user) {
    return res.status(404).json({ message: "Admin not found" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }

  return res.status(200).json(user || {});
});

// Handler for PUT /update-admin-profile
const updateAdminProfile = asyncHandler(async (req, res, next) => {
  const { fullname, email, password, oldPassword, image, age, genre, phone } = req.body || {};
  const adminId = req.user.id;

  const updatedFields = {};
  if (fullname) updatedFields.fullname = fullname;
  if (email) updatedFields.email = email;
  if (image) updatedFields.image = image;
  if (age) updatedFields.age = age;
  if (genre) updatedFields.genre = genre;
  if (phone) updatedFields.phone = phone;
  if (password) updatedFields.password = password;

  try {
    const updatedAdmin = await adminService.updateAdminProfile(adminId, updatedFields, oldPassword);
    res.status(200).json(updatedAdmin || {});
  } catch (error) {
    if (error.message.includes("Admin not found") || error.message.includes("Update failed") || error.message.includes("Old password is incorrect")) {
      return res.status(400).json({ error: error.message });
    }
    throw error;
  }
});

const getDailyStats = asyncHandler(async (req, res) => {
  const stats = await adminService.fetchDailyStats();
  res.json(stats);
});

const getUserActivity = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const parsedPage  = page  ? Math.max(1, parseInt(page, 10))  : null;
  const parsedLimit = limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : null;
  const result = await adminService.fetchUserActivity(parsedPage, parsedLimit);
  if (parsedPage && parsedLimit && result.pagination) {
    return res.json({ success: true, ...result });
  }
  res.json({ success: true, users: result || [] });
});

const getBookAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.fetchBookAnalytics();
  res.status(200).json(analytics);
});

const getMonthlyAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.fetchMonthlyAnalytics();
  res.status(200).json(analytics);
});

const getMonthlySignups = asyncHandler(async (req, res) => {
  const monthlyStats = await adminService.fetchMonthlySignups();
  res.status(200).json(monthlyStats);
});


module.exports = {
  getAdminProfile,
  updateAdminProfile,
  getDailyStats,
  getUserActivity,
  getBookAnalytics,
  getMonthlyAnalytics,
  getMonthlySignups, 
};