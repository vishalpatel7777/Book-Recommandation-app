const express = require("express");
const router = express.Router();
const authorController = require("../controllers/author.controller");
const { authenticateToken, isAuthor } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { z } = require("zod");

const authorRegisterSchema = z.object({
  username: z.string().min(4).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  fullname: z.string().min(1).max(100),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  age: z.coerce.number().min(13).max(120),
  genre: z.string().min(1),
  penName: z.string().min(1).max(100).optional(),
  bio: z.string().max(2000).optional(),
});

const authorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Public — author auth
router.post("/author/register", validate(authorRegisterSchema), authorController.register);
router.post("/author/login", validate(authorLoginSchema), authorController.login);

// Protected — author dashboard (requires author role)
router.get("/author/me", authenticateToken, isAuthor, authorController.me);
router.get("/author/dashboard", authenticateToken, isAuthor, authorController.dashboard);
router.get("/author/books", authenticateToken, isAuthor, authorController.myBooks);
router.put("/author/profile", authenticateToken, isAuthor, authorController.updateProfile);

module.exports = router;
