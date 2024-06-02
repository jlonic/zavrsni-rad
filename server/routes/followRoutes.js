const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");

router.post("/followUser", followController.followUser);
router.delete("/unfollowUser", followController.unfollowUser);


module.exports = router;