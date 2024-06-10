const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");
const followArtistController = require("../controllers/followArtistController");

//users
router.post("/followUser", followController.followUser);
router.delete("/unfollowUser", followController.unfollowUser);
router.get("/checkFollowStatus/:followed_id", followController.checkFollowStatus);


//artists
router.post("/followArtist", followArtistController.followArtist);
router.delete("/unfollowArtist", followArtistController.unfollowArtist);
router.get("/checkArtistFollowStatus/:artist_id", followArtistController.checkArtistFollowStatus);


module.exports = router;