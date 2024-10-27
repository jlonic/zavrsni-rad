const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/newNotification", notificationController.createNotification);
router.put("/editNotification", notificationController.editNotification);
router.delete("/deleteNotification", notificationController.deleteNotification);
router.delete("/deleteAllNotifications", notificationController.deleteAllNotifications);
router.get("/", notificationController.getNotifications);
router.put("/markAsRead", notificationController.markAsRead);
router.put("/markAsUnread", notificationController.markAsUnread);


module.exports = router;