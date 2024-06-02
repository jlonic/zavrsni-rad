const Message = require("../models/message");

const sendMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, message } = req.body;
        const newMessage = await Message.sendMessage(sender_id, receiver_id, message);
        res.json(newMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error sending message"});
    }
};

const getAllMessages = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.body;
        const messages = await Message.getAllMessages(sender_id, receiver_id);
        res.json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting messages"});
    }
};



module.exports = {
    sendMessage,
    getAllMessages,
};