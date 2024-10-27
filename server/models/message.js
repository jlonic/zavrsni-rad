const pool = require("../config/db");

const sendMessage = async (sender_id, receiver_id, message) => {
    const newMessage = await pool.query(
        "INSERT INTO messages (sender_id, receiver_id, message) VALUES($1, $2, $3) RETURNING *",
        [sender_id, receiver_id, message]);
    return newMessage.rows;
};

const getMessagesWithUser = async (sender_id, receiver_id) => { //to display messages between 2 users
    const messages = await pool.query(
        "SELECT m.*, u.username FROM messages m INNER JOIN users u ON u.user_id=m.receiver_id WHERE ((m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)) ORDER BY m.message_date ASC",
        [sender_id, receiver_id]);
    return messages.rows;
};

const getAllMessages = async (sender_id) => {
    const messages = await pool.query(
        "SELECT * FROM messages where sender_id = $1 OR receiver_id = $1",
        [sender_id]);
    return messages.rows;
};

const getConversations = async (sender_id) => {
    const conversations = await pool.query( //latest message from each conversation, inner join users for usernames
        "SELECT DISTINCT ON (LEAST (m.sender_id, m.receiver_id), GREATEST (m.sender_id, m.receiver_id)) m.*, u1.username AS sender_username, u2.username AS receiver_username FROM messages m INNER JOIN users u1 ON m.sender_id = u1.user_id INNER JOIN users u2 on m.receiver_id = u2.user_id WHERE m.sender_id = $1 OR m.receiver_id = $1 ORDER BY LEAST (m.sender_id, m.receiver_id), GREATEST (m.sender_id, m.receiver_id), m.message_date DESC",
        [sender_id]
    );
    return conversations.rows;
};

//delete specific message (for both users),  full clear chat history (only for 1 user)



module.exports = {
    sendMessage,
    getMessagesWithUser,
    getAllMessages,
    getConversations
};