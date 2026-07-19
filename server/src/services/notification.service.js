const Notification = require("../models/notification.model");

const storeNotification = async (notificationData) => {
    const { userId, book } = notificationData;

    const existingNotification = await Notification.findOne({ userId, book });
    if (existingNotification) {
        return { message: "Notification already exists", notification: existingNotification };
    }

    const notification = new Notification(notificationData);
    await notification.save();
    return { message: "Notification stored successfully", notification };
};

const fetchNotificationsByUserId = async (userId, page, limit) => {
    if (!userId) {
        throw new Error("userId is required");
    }
    if (page && limit) {
        const skip  = (page - 1) * limit;
        const total = await Notification.countDocuments({ userId });
        const data  = await Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    return Notification.find({ userId }).sort({ createdAt: -1 });
};

const deleteNotificationById = async (id, requestingUserId) => {
    if (!id) {
        throw new Error("Notification ID is required");
    }
    const notification = await Notification.findById(id);
    if (!notification) {
        throw new Error("Notification not found");
    }
    if (notification.userId.toString() !== requestingUserId) {
        throw new Error("Access denied");
    }
    await notification.deleteOne();
    return { message: "Notification deleted successfully" };
};

module.exports = {
    storeNotification,
    fetchNotificationsByUserId,
    deleteNotificationById,
};