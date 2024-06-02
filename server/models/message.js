const pool = require("../config/db");

const sendMessage = async (sender_id, receiver_id, message) => {
    const newMessage = await pool.query(
        "INSERT INTO messages (sender_id, receiver_id, message) VALUES($1, $2, $3) RETURNING *",
        [sender_id, receiver_id, message]);
    return newMessage.rows;
};

const getAllMessages = async (sender_id, receiver_id) => { //to display messages between 2 users
    const messages = await pool.query(
        "SELECT * FROM messages WHERE ((sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1))",
        [sender_id, receiver_id]);
    return messages.rows;
};

//delete specific message (for both users),  full clear chat history (only for 1 user)



module.exports = {
    sendMessage,
    getAllMessages,
};