const User = require("../models/user.model");
const { validatePassword } = require("../validators/auth.validator");
const emailService = require("./email.service");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { JWT_EXPIRES_IN, PASSWORD_RESET_EXPIRY_MS } = require("../config/constants");

// Helper to generate JWT token
const generateAuthToken = (user) => {
    const authClaims = {
        id: user._id,
        username: user.username,
        role: user.role,
    };
    return jwt.sign(
        authClaims,
        process.env.JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// --- Auth Step Validation Services ---

const validateStepOne = async ({ email, username, age }) => {
    if (username.length <= 4) {
        throw new Error("Username length should be greater than 4.");
    }
    if (age <= 0) {
        throw new Error("Age should be greater than 0.");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        throw new Error("Username already exists.");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new Error("Email already exists.");
    }

    return { message: "Step 1 validation successful. Proceed to Step 2." };
};

const validateStepTwo = ({ phone, password }) => {
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
        throw new Error("Phone number must be exactly 10 digits.");
    }
    if (!validatePassword(password)) {
        throw new Error("Password does not meet policy requirements.");
    }

    return { message: "Welcome.." };
};

// --- Core Auth Services ---

const registerUser = async (userData) => {
    const { email, username, password, age, genre, fullname, phone, image } = userData;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        const errorField = existingUser.username === username ? "Username" : "Email";
        throw new Error(`${errorField} already exists.`);
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const defaultImage = "https://www.bing.com/th?id=OIP.S_BEyoTYNIwRpRXmQWtKJAHaHa";

    // Password hashing is handled by the Mongoose pre-save hook in user.model.js

    const newUser = new User({
        username, email, password, age, genre, fullname, phone,
        image: image || defaultImage,
        isVerified: false,
        verificationToken,
    });

    await newUser.save();
    
    const verificationLink = `${process.env.BASE_URL || "http://localhost:1000"}/api/v1/verify-email/${verificationToken}`;
    try {
        await emailService.sendWelcomeEmail(email, newUser.fullname, verificationLink);
    } catch { /* non-fatal — user still created */ }

    return { message: "User created successfully. Please check your email for verification." };
};

const verifyUserEmail = async (token) => {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        throw new Error("Invalid or Expired Link");
    }

    if (user.isVerified) {
        return { message: "Email already verified", redirect: true };
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    
    return { message: "Verification successful", redirect: true };
};

const loginUser = async ({ email, password }) => {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new Error("Incorrect username or password");
    }

    if (!existingUser.isVerified) {
        throw new Error("Please verify your email before logging in.");
    }

    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
        throw new Error("Incorrect username or password");
    }
    
    const token = generateAuthToken(existingUser);
    
    await User.updateOne(
        { _id: existingUser._id },
        { $set: { lastLogin: new Date() } }
    );
    
    return {
        user: { 
            id: existingUser._id, 
            role: existingUser.role,
            username: existingUser.username,
            email: existingUser.email
        },
        token
    };
};

const initiatePasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("No account found with this email");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + PASSWORD_RESET_EXPIRY_MS;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    try {
        await emailService.sendPasswordResetEmail(email, user.fullname, resetLink);
    } catch { /* non-fatal — token still valid */ }
    
    return { message: "Password reset link sent to your email" };
};

const completePasswordReset = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error("Invalid or expired reset link");
    }
    
    // IMPORTANT FIX: Manually set password property on user object 
    // Mongoose pre('save') hook handles the hashing here since we use .save()
    user.password = newPassword; 
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();
    
    return { message: "Password reset successfully" };
};

module.exports = {
    validateStepOne,
    validateStepTwo,
    registerUser,
    verifyUserEmail,
    loginUser,
    initiatePasswordReset,
    completePasswordReset,
    generateAuthToken
};