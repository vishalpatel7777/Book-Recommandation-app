const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { BCRYPT_SALT_ROUNDS } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true }, // Added trim
    email: { type: String, required: true, unique: true, trim: true, lowercase: true }, // Added trim and lowercase
    password: { type: String, required: true, minlength: 6 }, // Added minlength check
    fullname: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    genre: { type: String, required: true, trim: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    image: {
      type: String,
      default: "https://www.bing.com/th?id=OIP.S_BEyoTYNIwRpRXmQWtKJAHaHa", // Placeholder image
    },
    role: { type: String, default: "user", enum: ["user", "admin"], index: true }, // Added index
    lastLogin: { type: Date, default: null },
    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Book", default: [] }, // Corrected ref to 'Book'
    ],
    cart: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Book", default: [] }, // Corrected ref to 'Book'
    ],
    order: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }, // Corrected ref to 'Order'
    ],
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpiry: { type: Number, default: null },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// --- Mongoose Pre-Save Middleware for Password Hashing (CRITICAL SECURITY STEP) ---
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// --- Mongoose Instance Method to Compare Password (CRITICAL AUTH STEP) ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


// Use singular, capitalized model name for export
module.exports = mongoose.model("User", userSchema); // Corrected model name to 'User'