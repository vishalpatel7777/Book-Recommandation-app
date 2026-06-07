const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validate } = require("../middleware/validate.middleware");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateStep1Schema,
  validateStep2Schema,
} = require("../validators/auth.validator");

// --- Public Auth Routes ---
router.post("/validate-step1", authLimiter, validate(validateStep1Schema), authController.validateStep1);
router.post("/validate-step2", authLimiter, validate(validateStep2Schema), authController.validateStep2);
router.post("/signup", authLimiter, validate(signupSchema), authController.signup);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/logout", authController.logout);

// --- Password Reset Routes ---
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password/:token", authLimiter, validate(resetPasswordSchema), authController.resetPassword);

module.exports = router;