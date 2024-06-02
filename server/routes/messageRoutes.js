const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/sendMessage", messageController.sendMessage);
router.get("/getAllMessages", messageController.getAllMessages);

module.exports = router;