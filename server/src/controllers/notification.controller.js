const notificationService = require("../services/notification.service");

const addNotification = async (req, res, next) => {
    try {
        const body = { ...req.body, userId: req.user.id };
        const result = await notificationService.storeNotification(body);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const getNotificationsByUserId = async (req, res, next) => {
    try {
        if (req.params.userId && req.params.userId !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }
        const { page, limit } = req.query;
        const parsedPage  = page  ? Math.max(1, parseInt(page, 10))  : null;
        const parsedLimit = limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : null;
        const result = await notificationService.fetchNotificationsByUserId(req.user.id, parsedPage, parsedLimit);
        if (parsedPage && parsedLimit && result.pagination) {
            return res.json(result);
        }
        res.json(result || []);
    } catch (error) {
        next(error);
    }
};

const removeNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await notificationService.deleteNotificationById(id, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message.includes("Notification not found")) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("Access denied")) {
            return res.status(403).json({ error: error.message });
        }
        next(error);
    }
};

module.exports = {
    addNotification,
    getNotificationsByUserId,
    removeNotification,
};
