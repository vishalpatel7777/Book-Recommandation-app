const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateToken, isAdmin } = require("../middleware/auth.middleware");

// --- Authenticated User Profile Routes ---
router.get("/user-information", authenticateToken, userController.getUserInformation);
router.put("/update", authenticateToken, userController.updateProfile);

// --- Admin User Management Routes (Assuming Admin Check in Middleware or Controller) ---
router.get("/all-users", authenticateToken, isAdmin, userController.getAllUsers);
router.delete("/delete-user/:id", authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;
