const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/sendMessage", messageController.sendMessage);
router.get("/getMessagesWithUser/:receiver_id", messageController.getMessagesWithUser);
router.get("/getAllMessages", messageController.getAllMessages);
router.get("/getConversations", messageController.getConversations);

module.exports = router;