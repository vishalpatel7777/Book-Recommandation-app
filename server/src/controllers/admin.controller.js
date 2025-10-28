const adminService = require("../services/admin.service");
const bcrypt = require("bcryptjs");

// Handler for GET /get-admin-profile
const getAdminProfile = async (req, res, next) => {
  try {
    // Authentication middleware already verified the user is an admin and set req.user
    const adminId = req.user.id; 
    
    // Check for ID mismatch if client provided an ID in headers (optional sanity check)
    if (req.headers.id && req.headers.id !== adminId) {
       return res.status(403).json({ message: "Token and client ID mismatch" });
    }

    const user = await adminService.fetchAdminProfile(adminId);
    
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    // Role check is redundant if isAdmin middleware is used, but good for safety
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    return res.status(200).json(user || {});
  } catch (error) {
    next(error); // Pass error to central error handler
  }
};

// Handler for PUT /update-admin-profile
const updateAdminProfile = async (req, res, next) => {
  try {
    const { fullname, email, password, oldPassword, image, age, genre, phone } = req.body || {};
    const adminId = req.user.id; // Get ID from authenticated token

    // Filter updated fields
    const updatedFields = {};
    if (fullname) updatedFields.fullname = fullname;
    if (email) updatedFields.email = email;
    if (image) updatedFields.image = image;
    if (age) updatedFields.age = age;
    if (genre) updatedFields.genre = genre;
    if (phone) updatedFields.phone = phone;
    if (password) updatedFields.password = password; // Hashing handled by model or service layer

    const updatedAdmin = await adminService.updateAdminProfile(adminId, updatedFields, oldPassword);

    res.status(200).json(updatedAdmin || {});
  } catch (error) {
    if (error.message.includes("Admin not found") || error.message.includes("Update failed") || error.message.includes("Old password is incorrect")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// Handler for GET /daily
const getDailyStats = async (req, res, next) => {
  try {
    const stats = await adminService.fetchDailyStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// Handler for GET /user-activity
const getUserActivity = async (req, res, next) => {
  try {
    const users = await adminService.fetchUserActivity();
    res.json({ success: true, users: users || [] });
  } catch (error) {
    next(error);
  }
};

// Handler for GET /book-analytics
const getBookAnalytics = async (req, res, next) => {
  try {
    const analytics = await adminService.fetchBookAnalytics();
    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};

// Handler for GET /monthly-analytics
const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const analytics = await adminService.fetchMonthlyAnalytics();
    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};


// Handler for GET /monthly-stats
const getMonthlySignups = async (req, res, next) => {
    try {
        // Role check (assuming authenticateToken and isAdmin middleware protect the route)
        const monthlyStats = await adminService.fetchMonthlySignups();
        res.status(200).json(monthlyStats);
    } catch (error) {
        next(error); // Pass error to central error handler
    }
};


module.exports = {
  getAdminProfile,
  updateAdminProfile,
  getDailyStats,
  getUserActivity,
  getBookAnalytics,
  getMonthlyAnalytics,
  getMonthlySignups, 
};