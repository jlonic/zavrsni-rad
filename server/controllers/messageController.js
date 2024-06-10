const Message = require("../models/message");
const jwt = require('jsonwebtoken');
const http = require('http'); // Import the http module

const io = require('socket.io')(http);

const sendMessage = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const sender_id = user.user_id;
        const { receiver_id, message } = req.body;
        const newMessage = await Message.sendMessage(sender_id, receiver_id, message);

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