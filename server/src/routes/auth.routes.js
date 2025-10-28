const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// --- Public Auth Routes ---
router.post("/validate-step1", authController.validateStep1);
router.post("/validate-step2", authController.validateStep2);
router.post("/signup", authController.signup);
router.get("/verify-email/:token", authController.verifyEmail); // User-facing link
router.post("/login", authController.login);

// --- Password Reset Routes ---
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;