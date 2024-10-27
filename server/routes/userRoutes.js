const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/all", userController.getAllUsers);
router.post("/register", userController.createUser);
router.delete("/delete/:user_id", userController.deleteUser);
router.put("/uploadProfilePicture/", userController.uploadProfilePicture);
router.put("/removeProfilePicture/:user_id", userController.removeProfilePicture);
router.put("/updateEmail/", userController.updateEmail);
router.put("/updatePassword/", userController.updatePassword); //for user updating his own password
router.get("/:username", userController.getUserByUsername);
router.get("/user/:user_id", userController.getUsernameByUserId);
router.put("/update/:user_id", userController.updateUser);
router.get("/get/:user_id", userController.getUserById);
router.put("/updatePassword/:user_id", userController.updateUserPassword); //for admin updating user's password

module.exports = router;