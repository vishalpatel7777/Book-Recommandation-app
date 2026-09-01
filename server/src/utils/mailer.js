const nodemailer = require("nodemailer");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a pre-configured email via the application's transporter.
 * @param {object} mailOptions - Nodemailer mail options (to, subject, html/text)
 */
const logger = require("../config/logger");

const sendMail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info("Email sent", { messageId: info.messageId, to: mailOptions.to });
        return true;
    } catch (error) {
        logger.error("Email send failed", { error: error.message, to: mailOptions.to });
        throw new Error("Failed to send email.");
    }
};

module.exports = { sendMail };