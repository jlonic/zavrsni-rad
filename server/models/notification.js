const pool = require("../config/db");

const createNotification = async (user_id, notification_text) => {
    const newNotification = await pool.query(
        "INSERT INTO notifications (user_id, notification_text) VALUES($1, $2) RETURNING *",
        [user_id, notification_text]);
    return newNotification.rows;
};

const deleteNotification = async (notification_id) => {
    const deletedNotification = await pool.query(
        "DELETE FROM notifications WHERE notification_id = $1 RETURNING *",
        [notification_id]);
    return deletedNotification.rows;
};

const editNotification = async (notification_id, notification_text) => { //also update the date?
    const editedNotification = await pool.query(
        "UPDATE notifications SET notification_text = $1, notification_date = CURRENT_TIMESTAMP WHERE notification_id = $2 RETURNING *",
        [notification_text, notification_id]);
    return editedNotification.rows;
};

const deleteAllNotifications = async (user_id) => {
    const deletedNotifications = await pool.query(
        "DELETE FROM notifications WHERE user_id = $1 RETURNING *",
        [user_id]);
    return deletedNotifications.rows;
};

const getNotifications = async (user_id) => {
    const notifications = await pool.query(
        "SELECT * FROM notifications WHERE user_id = $1",
        [user_id]);
    return notifications.rows;
};

const markAsRead = async (notification_id) => {
    const editedNotification = await pool.query(
        "UPDATE notifications SET notification_read = true WHERE notification_id = $1 RETURNING *",
        [notification_id]);
    return editedNotification.rows;
};

const markAsUnread = async (notification_id) => {
    const editedNotification = await pool.query(
        "UPDATE notifications SET notification_read = false WHERE notification_id = $1 RETURNING *",
        [notification_id]);
    return editedNotification.rows;
};

const existingNotification = async (receiver_id) => {
    const notification = await pool.query(
        "SELECT * FROM notifications WHERE user_id = $1 AND notification_read = false",
        [receiver_id]);
    return notification.rows;
};

const existingReadNotification = async (receiver_id) => {
    const notification = await pool.query(
        "SELECT * FROM notifications WHERE user_id = $1 AND notification_read = true",
        [receiver_id]);
    return notification.rows;
};

module.exports = {
    createNotification,
    deleteNotification,
    editNotification,
    deleteAllNotifications,
    getNotifications,
    markAsRead,
    markAsUnread,
    existingNotification,
    existingReadNotification
};