const notificationService = require("../services/notification.service");

const addNotification = async (req, res, next) => {
    try {
        const result = await notificationService.storeNotification(req.body);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const getNotificationsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const notifications = await notificationService.fetchNotificationsByUserId(userId);
        res.json(notifications || []);
    } catch (error) {
        next(error);
    }
};

const removeNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await notificationService.deleteNotificationById(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message.includes("Notification not found")) {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
};

module.exports = {
    addNotification,
    getNotificationsByUserId,
    removeNotification,
};