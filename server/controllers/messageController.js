const Message = require("../models/message");
const Notification = require("../models/notification");
const jwt = require('jsonwebtoken');
const http = require('http');

const io = require('socket.io')(http);

const sendMessage = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const sender_id = user.user_id;
        const { receiver_id, message } = req.body;
        const newMessage = await Message.sendMessage(sender_id, receiver_id, message);

        const existingNotification = await Notification.existingNotification(receiver_id);
        if (existingNotification.length === 0) {
            await Notification.createNotification(receiver_id, `You have new messages`);
        } else {
            await Notification.editNotification(existingNotification[0].notification_id, `You have new messages`);
        }

        const existingReadNotification = await Notification.existingReadNotification(receiver_id);
        if (existingReadNotification.length > 0) {
            await Notification.deleteNotification(existingReadNotification[0].notification_id);
        }

        io.emit('newMessage', { sender_id, receiver_id, message, message_date: newMessage.message_date });
        res.json(newMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error sending message" });
    }
};

const getMessagesWithUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const sender_id = user.user_id;
        const { receiver_id } = req.params;

        const existingNotification = await Notification.existingNotification(sender_id);
        if (existingNotification.length > 0) {
            await Notification.deleteNotification(existingNotification[0].notification_id);
        }

        const messages = await Message.getMessagesWithUser(sender_id, receiver_id);
        res.json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting messages" });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const sender_id = user.user_id;
        const messages = await Message.getAllMessages(sender_id);
        res.json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting messages" });
    }
};

const getConversations = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const sender_id = user.user_id;
        const conversations = await Message.getConversations(sender_id);
        res.json(conversations);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting conversations" });
    }
};

module.exports = {
    sendMessage,
    getMessagesWithUser,
    getAllMessages,
    getConversations
};