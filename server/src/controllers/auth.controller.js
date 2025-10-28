const authService = require("../services/auth.service");
const { passwordPolicyError } = require("../validators/auth.validator");

// Handler for POST /validate-step1
const validateStep1 = async (req, res, next) => {
    try {
        const { email, username, age } = req.body || {};
        if (!email || !username || !age) {
            return res.status(400).json({ message: "Email, username, and age are required." });
        }
        
        const result = await authService.validateStepOne({ email, username, age });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Handler for POST /validate-step2
const validateStep2 = async (req, res, next) => {
    try {
        const { phone, password } = req.body || {};
        if (!phone || !password) {
            return res.status(400).json({ message: "Phone number and password are required." });
        }
        
        const result = authService.validateStepTwo({ phone, password });
        return res.status(200).json({ message: "Step 2 validation successful." });
    } catch (error) {
        const errorMessage = error.message.includes("Password does not meet") ? passwordPolicyError.message : error.message;
        return res.status(400).json({ message: errorMessage });
    }
};

// Handler for POST /signup
const signup = async (req, res, next) => {
    try {
        const { email, username, password, age, genre, fullname, phone } = req.body || {};
        if (!email || !username || !password || !age || !genre || !fullname || !phone) {
            return res.status(400).json({ message: "All required fields are missing." });
        }
        
        const result = await authService.registerUser(req.body);
        return res.status(201).json(result);
    } catch (error) {
        const status = error.message.includes("already exists") ? 400 : 500;
        return res.status(status).json({ message: error.message });
    }
};

// Handler for GET /verify-email/:token
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params || {};
        if (!token) {
            return res.status(400).send("Invalid request");
        }
        
        const result = await authService.verifyUserEmail(token);
        
        if (result.redirect) {
            const redirectPath = result.message.includes("already verified") 
                ? "/email-already-verified" 
                : "/verification-success";
            return res.redirect(`https://bookmosaic.netlify.app${redirectPath}`);
        }
        
    } catch (error) {
        // Render or redirect error pages for user-facing links
        if (error.message.includes("Invalid or Expired Link")) {
             // Example of sending an error HTML response
             return res.status(400).send("<html>... Invalid Token HTML ...</html>");
        }
        next(error);
    }
};

// Handler for POST /login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const result = await authService.loginUser({ email, password });
        
        return res.status(200).json({
            id: result.user.id,
            role: result.user.role,
            token: result.token,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Handler for POST /forgot-password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const result = await authService.initiatePasswordReset(email);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

// Handler for POST /reset-password/:token
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params || {};
        const { password } = req.body || {};

        if (!token) {
            return res.status(400).json({ message: "Reset token is required" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const result = await authService.completePasswordReset(token, password);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    validateStep1,
    validateStep2,
    signup,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword
};