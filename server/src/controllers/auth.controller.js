const authService = require("../services/auth.service");
const { passwordPolicyError } = require("../validators/auth.validator");
const appConfig = require("../config/app.config");

const fail400 = (res, msg) => res.status(400).json({ message: msg });

const validateStep1 = async (req, res, next) => {
  try {
    const { email, username, age } = req.body || {};
    if (!email || !username || !age) {
      return res.status(400).json({ message: "Email, username, and age are required." });
    }
    const result = await authService.validateStepOne({ email, username, age });
    return res.status(200).json(result);
  } catch (error) {
    return fail400(res, error.message);
  }
};

const validateStep2 = async (req, res, next) => {
  try {
    const { phone, password } = req.body || {};
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone number and password are required." });
    }
    authService.validateStepTwo({ phone, password });
    return res.status(200).json({ message: "Step 2 validation successful." });
  } catch (error) {
    const errorMessage = error.message.includes("Password does not meet")
      ? passwordPolicyError.message
      : error.message;
    return fail400(res, errorMessage);
  }
};

const signup = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    const status = error.message.includes("already exists") ? 400 : 500;
    return res.status(status).json({ message: error.message });
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params || {};
    if (!token) return res.status(400).send("Invalid request");

    const result = await authService.verifyUserEmail(token);
    if (result.redirect) {
      const redirectPath = result.message.includes("already verified")
        ? "/email-already-verified"
        : "/verification-success";
      return res.redirect(`${process.env.FRONTEND_URL}${redirectPath}`);
    }
    return next(new Error("Unexpected verification result"));
  } catch (error) {
    if (error.message.includes("Invalid or Expired Link")) {
      return res.status(400).send("<html><body><h2>Invalid or expired verification link.</h2></body></html>");
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    // Set JWT in HttpOnly cookie — inaccessible to JavaScript
    res.cookie("access_token", result.token, appConfig.cookie);

    // Live event tracking (non-blocking)
    try {
      const cmsService = require("../services/cms.service");
      cmsService.logEvent({ type: "login", userId: result.user.id, user: result.user.username, meta: `login ${result.user.username}`, ip: req.ip || req.headers["x-forwarded-for"] || "" });
    } catch (_) {}

    // Return user info only (NO token in response body)
    return res.status(200).json({
      id: result.user.id,
      role: result.user.role,
      username: result.user.username,
      email: result.user.email,
    });
  } catch (error) {
    // log failed login for admin insight
    try {
      const cmsService = require("../services/cms.service");
      cmsService.logEvent({ type: "failed-login", user: email || "unknown", meta: email ? `failed login ${email}` : "failed login", ip: req.ip || "" });
    } catch (_) {}
    return fail400(res, error.message);
  }
};

const logout = (req, res) => {
  res.clearCookie("access_token", appConfig.cookie);
  return res.status(200).json({ message: "Logged out successfully." });
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email is required" });
    const result = await authService.initiatePasswordReset(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params || {};
    const { password } = req.body || {};
    if (!token) return res.status(400).json({ message: "Reset token is required" });
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const result = await authService.completePasswordReset(token, password);
    return res.status(200).json(result);
  } catch (error) {
    return fail400(res, error.message);
  }
};

module.exports = {
  validateStep1,
  validateStep2,
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};