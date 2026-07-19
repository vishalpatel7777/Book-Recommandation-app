const User = require("../models/user.model");

const fetchUserInformation = async (userId) => {
    const data = await User.findById(userId).select("-password");
    if (!data) {
        throw new Error("User not found");
    }
    return data;
};


const updateUserProfile = async (userId, updateData) => {
    
    // NOTE: If the updateData included 'password', you would manually hash it here 
    // before passing it to findByIdAndUpdate. Since the current update only includes 
    // genre/age, it's safe, but the logic should be handled here, not in the model hook.
    
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    ).select("-password");

    if (!updatedUser) {
        throw new Error("User not found");
    }
    return { message: "User updated successfully" };
};

const fetchAllUsers = async () => {
    const users = await User.find({}, "-password");
    return users;
};

const deleteUserById = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new Error("User not found");
    }
    return { message: "User deleted successfully" };
};

module.exports = {
    fetchUserInformation,
    updateUserProfile,
    fetchAllUsers,
    deleteUserById
};