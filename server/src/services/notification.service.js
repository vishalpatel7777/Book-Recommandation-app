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

const fetchNotificationsByUserId = async (userId) => {
    if (!userId) {
        throw new Error("userId is required");
    }
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return notifications;
};

const deleteNotificationById = async (id) => {
    if (!id) {
        throw new Error("Notification ID is required");
    }
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
        throw new Error("Notification not found");
    }
    return { message: "Notification deleted successfully" };
};

module.exports = {
    storeNotification,
    fetchNotificationsByUserId,
    deleteNotificationById,
};