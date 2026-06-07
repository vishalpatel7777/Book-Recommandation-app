const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: passwordSchema,
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  age: z.coerce.number().int().min(1, "Age must be greater than 0").max(120),
  genre: z.string().min(1, "Genre is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  password: passwordSchema,
});

const validateStep1Schema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(30, "Username must be at most 30 characters"),
  age: z.coerce.number().int().min(1, "Age must be greater than 0"),
});

const validateStep2Schema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: passwordSchema,
});

const validatePassword = (password) => passwordSchema.safeParse(password).success;

module.exports = {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateStep1Schema,
  validateStep2Schema,
  validatePassword,
};