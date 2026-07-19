const { sendMail } = require("../utils/mailer");

const FROM = process.env.EMAIL_USER;
const SITE = process.env.FRONTEND_URL || "http://localhost:5173";
const BRAND = "bookMosaic";

const sendWelcomeEmail = async (email, fullname, verificationLink) => {
    await sendMail({
        from: FROM,
        to: email,
        subject: `Welcome to ${BRAND} — Verify Your Email`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 560px;">
                <h2 style="color: #3D6B52;">Welcome to ${BRAND}! 📚</h2>
                <p>Hi ${fullname || "there"},</p>
                <p>Thank you for joining. Please verify your email to start reading:</p>
                <p style="text-align: center; margin: 24px 0;">
                    <a href="${verificationLink}" style="background: #3D6B52; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Verify My Email
                    </a>
                </p>
                <p style="font-size: 12px; color: #888;">If you didn't sign up, ignore this email.</p>
            </div>
        `,
    });
};

const sendPasswordResetEmail = async (email, fullname, resetLink) => {
    await sendMail({
        from: FROM,
        to: email,
        subject: `Reset Your ${BRAND} Password`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 560px;">
                <h2 style="color: #3D6B52;">Password Reset</h2>
                <p>Hi ${fullname || "there"},</p>
                <p>We received a password reset request for your account. This link expires in 1 hour:</p>
                <p style="text-align: center; margin: 24px 0;">
                    <a href="${resetLink}" style="background: #3D6B52; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Reset Password
                    </a>
                </p>
                <p style="font-size: 12px; color: #888;">If you didn't request this, ignore this email. Your password will not change.</p>
            </div>
        `,
    });
};

const sendPurchaseConfirmationEmail = async (email, { username, bookTitle, bookAuthor, amount, orderId, purchaseDate }) => {
    await sendMail({
        from: FROM,
        to: email,
        subject: `Your ${BRAND} purchase: ${bookTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 560px;">
                <h2 style="color: #3D6B52;">Purchase Confirmed ✅</h2>
                <p>Hi ${username || "there"},</p>
                <p>Your purchase was successful. The book is now in your library.</p>
                <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0 0 8px; font-weight: bold; font-size: 16px;">${bookTitle}</p>
                    <p style="margin: 0 0 4px; color: #555;">by ${bookAuthor}</p>
                    <p style="margin: 8px 0 0; font-size: 18px; font-weight: bold; color: #3D6B52;">₹${amount}</p>
                </div>
                <p style="font-size: 12px; color: #888;">Order ID: ${orderId} &nbsp;|&nbsp; Date: ${purchaseDate}</p>
                <p style="margin-top: 20px; text-align: center;">
                    <a href="${SITE}/profile/wishlist" style="background: #3D6B52; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px;">
                        Go to My Library
                    </a>
                </p>
            </div>
        `,
    });
};

const sendRefundApprovedEmail = async (email, { username, bookTitle, amount, refundId }) => {
    await sendMail({
        from: FROM,
        to: email,
        subject: `Your refund of ₹${amount} has been approved`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 560px;">
                <h2 style="color: #3D6B52;">Refund Approved ✅</h2>
                <p>Hi ${username || "there"},</p>
                <p>Your refund request for <strong>${bookTitle}</strong> (₹${amount}) has been approved.</p>
                <p>The refund will be credited to your original payment method within 5–7 business days.</p>
                <p style="font-size: 12px; color: #888;">Refund ID: ${refundId}</p>
            </div>
        `,
    });
};

const sendRefundRejectedEmail = async (email, { username, bookTitle, amount, refundId, reason }) => {
    await sendMail({
        from: FROM,
        to: email,
        subject: `Your refund request for ${bookTitle} was not approved`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 560px;">
                <h2 style="color: #c0392b;">Refund Not Approved</h2>
                <p>Hi ${username || "there"},</p>
                <p>We were unable to process your refund request for <strong>${bookTitle}</strong> (₹${amount}).</p>
                ${reason ? `<p style="background: #fef3f2; padding: 12px; border-radius: 6px; color: #555;">Reason: ${reason}</p>` : ""}
                <p>If you have questions, please contact our support team.</p>
                <p style="font-size: 12px; color: #888;">Refund ID: ${refundId}</p>
            </div>
        `,
    });
};

const sendAdminGrantEmail = async (email, { username, bookTitle, bookAuthor }) => {
    await sendMail({
        from: FROM,
        to: email,
        subject: `${BRAND}: Access granted to "${bookTitle}"`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 560px;">
                <h2 style="color: #3D6B52;">Book Access Granted 🎁</h2>
                <p>Hi ${username || "there"},</p>
                <p>An admin has granted you free access to:</p>
                <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0 0 4px; font-weight: bold;">${bookTitle}</p>
                    <p style="margin: 0; color: #555;">by ${bookAuthor}</p>
                </div>
                <p style="text-align: center; margin-top: 20px;">
                    <a href="${SITE}/profile/wishlist" style="background: #3D6B52; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px;">
                        Go to My Library
                    </a>
                </p>
            </div>
        `,
    });
};

module.exports = {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPurchaseConfirmationEmail,
    sendRefundApprovedEmail,
    sendRefundRejectedEmail,
    sendAdminGrantEmail,
};
