const User = require("../models/user.model");
const { validatePassword } = require("../validators/auth.validator");
const { sendMail } = require("../utils/mailer");
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
    
    // Send verification email
    const verificationLink = `${process.env.BASE_URL || "http://localhost:1000"}/api/v1/verify-email/${verificationToken}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎉 Welcome to bookMosaic – Verify Your Email",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4A90E2;">Welcome to bookMosaic! 📚</h2>
                <p>Hi there,</p>
                <p>Thank you for joining <strong>bookMosaic</strong>! To get started, please verify your email by clicking the button below:</p>
                <p style="text-align: center;">
                    <a href="${verificationLink}" style="background-color: #4A90E2; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        ✅ Verify My Email
                    </a>
                </p>
                <p>If you didn’t sign up for bookMosaic, you can safely ignore this email.</p>
                <p>Happy Reading! 📖</p>
                <p>Best Regards,<br><strong>The bookMosaic Team</strong></p>
                <hr>
                <p style="font-size: 12px; color: #888;">📩 Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
                <p style="font-size: 12px; color: #888;">🌍 Visit us: <a href="https://bookmosaic.netlify.app/">www.bookMosaic.com</a></p>
            </div>
        `,
    };
    // await sendMail(mailOptions); 

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
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🔑 Reset Your bookMosaic Password",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4A90E2;">Password Reset Request</h2>
                <p>Hi ${user.fullname || "there"},</p>
                <p>We received a request to reset your bookMosaic password. Click the button below to reset it:</p>
                <p style="text-align: center;">
                    <a href="${resetLink}" style="background-color: #4A90E2; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        🔄 Reset Password
                    </a>
                </p>
                <p>This link will expire in 1 hour. If you didn’t request a reset, please ignore this email.</p>
                <p>Best Regards,<br><strong>The bookMosaic Team</strong></p>
                <hr>
                <p style="font-size: 12px; color: #888;">📩 Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
            </div>
        `,
    };
    // await sendMail(mailOptions); 
    
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