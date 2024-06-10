const Notifications = require('../models/notification');
const jwt = require('jsonwebtoken');

const createNotification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        //----
        const { user_id, notification_text } = req.body;
        const newNotification = await Notifications.createNotification(user_id, notification_text);
        res.json(newNotification);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error creating notification" });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { notification_id } = req.body;
        const deletedNotification = await Notifications.deleteNotification(notification_id);
        res.json(deletedNotification);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting notification" });
    }
};

const editNotification = async (req, res) => { //update the date?
    try {
        const { notification_id, notification_text } = req.body;
        const editedNotification = await Notifications.editNotification(notification_id, notification_text);
        res.json(editedNotification);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error editing notification" });
    }
};

const deleteAllNotifications = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { user_id } = req.body;
        const deletedNotifications = await Notifications.deleteAllNotifications(user_id);
        res.json(deletedNotifications);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting notifications" });
    }
};

const getNotifications = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const notifications = await Notifications.getNotifications(user_id);
        res.json(notifications);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting notifications" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { notification_id } = req.body;
        const markedAsRead = await Notifications.markAsRead(notification_id);
        res.json(markedAsRead);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error marking notification as read" });
    }
};

const markAsUnread = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { notification_id } = req.body;
        const markedAsUnread = await Notifications.markAsUnread(notification_id);
        res.json(markedAsUnread);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error marking notification as unread" });
    }
};


module.exports = {
    createNotification,
    deleteNotification,
    editNotification,
    deleteAllNotifications,
    getNotifications,
    markAsRead,
    markAsUnread
};