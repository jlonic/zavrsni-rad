const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//router.get("/all", userController.getAllUsers);
router.post("/register", userController.createUser);
router.delete("/delete/", userController.deleteUser);
router.put("/uploadProfilePicture/", userController.uploadProfilePicture);
router.put("/removeProfilePicture/", userController.removeProfilePicture);
router.put("/updateEmail/", userController.updateEmail);
router.put("/updatePassword/", userController.updatePassword);
router.get("/:username", userController.getUserByUsername);
router.get("/user/:user_id", userController.getUsernameByUserId);

module.exports = router;