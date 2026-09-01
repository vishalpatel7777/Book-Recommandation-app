const authorService = require("../services/author.service");
const authService = require("../services/auth.service");
const appConfig = require("../config/app.config");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");

const register = asyncHandler(async (req, res) => {
  const result = await authorService.registerAuthor(req.body);
  logger.info("Author registered", { email: req.body.email, username: req.body.username });
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  if (result.user.role !== "author" && result.user.role !== "admin") {
    return res.status(403).json({ message: "This account is not an author. Please use regular login or register as author." });
  }
  res.cookie("access_token", result.token, appConfig.cookie);
  logger.info("Author login", { email, username: result.user.username });
  res.json({ id: result.user.id, role: result.user.role, username: result.user.username, email: result.user.email });
});

const dashboard = asyncHandler(async (req, res) => {
  const data = await authorService.getAuthorDashboard(req.user.id);
  res.json({ success: true, data });
});

const myBooks = asyncHandler(async (req, res) => {
  const books = await authorService.getAuthorBooks(req.user.id);
  res.json({ success: true, data: books });
});

const me = asyncHandler(async (req, res) => {
  const data = await authorService.getAuthorDashboard(req.user.id);
  res.json({ success: true, data: data.profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const updated = await authorService.updateAuthorProfile(req.user.id, req.body);
  logger.info("Author profile updated", { userId: req.user.id });
  res.json({ success: true, data: updated });
});

module.exports = { register, login, dashboard, myBooks, me, updateProfile };
