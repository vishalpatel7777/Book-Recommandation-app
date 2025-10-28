const userService = require("../services/user.service");
const adminService = require("../services/admin.service"); // Used for admin-level user management

// Handler for GET /user-information
const getUserInformation = async (req, res, next) => {
    try {
        // FIX: Remove redundant/spoofable header check. Use ONLY the token ID.
        // We know authenticateToken ran successfully, so req.user.id MUST exist.
        const userId = req.user.id; 
        
        if (!userId) {
            // This case should be handled by the middleware, but serves as a final safety check.
            return res.status(401).json({ message: "Authentication required." });
        }

        const data = await userService.fetchUserInformation(userId);
        return res.status(200).json(data);
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};

// Handler for PUT /update (Apply the same logic here)
const updateProfile = async (req, res, next) => {
    try {
        // FIX: Use ONLY the token ID for the authenticated user
        const userId = req.user.id;
        const { genre, age } = req.body || {};
        
        if (!userId) {
            return res.status(401).json({ message: "Authentication required." });
        }

        const updateData = {};
        if (genre) updateData.genre = genre;
        if (age) updateData.age = age;

        const result = await userService.updateUserProfile(userId, updateData);
        return res.status(200).json(result);
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};



// Handler for GET /all-users (Admin only)
const getAllUsers = async (req, res, next) => {
    try {
        // Role check (assuming authenticateToken and isAdmin middleware protect the route)
        const users = await userService.fetchAllUsers();
        res.json(users || []);
    } catch (error) {
        next(error);
    }
};

// Handler for DELETE /delete-user/:id (Admin only)
const deleteUser = async (req, res, next) => {
    try {
        const userIdToDelete = req.params.id;
        if (!userIdToDelete) {
            return res.status(400).json({ message: "User ID to delete is required" });
        }
        
        // This should ideally check if the requester is an Admin before calling service
        const result = await userService.deleteUserById(userIdToDelete);
        res.json(result);
    } catch (error) {
        if (error.message.includes("User not found")) {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
};


module.exports = {
    getUserInformation,
    updateProfile,
    getAllUsers,
    deleteUser
};