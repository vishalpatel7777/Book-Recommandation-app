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
const sendMail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email.");
    }
};

module.exports = { sendMail };