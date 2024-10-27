const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.post("/add-favorite-album/", favoriteController.addFavoriteAlbum);
router.delete("/remove-favorite-album/", favoriteController.removeFavoriteAlbum);
router.post("/add-favorite-track/", favoriteController.addFavoriteTrack);
router.delete("/remove-favorite-track/", favoriteController.removeFavoriteTrack);
router.get("/check-album-status/:album_id", favoriteController.checkFavoriteAlbumStatus);
router.get("/check-track-status/:track_id", favoriteController.checkFavoriteTrackStatus);
router.get("/user-favorite-albums/:username", favoriteController.getUserFavoriteAlbums);
router.get("/user-favorite-tracks/:username", favoriteController.getUserFavoriteTracks);

module.exports = router;