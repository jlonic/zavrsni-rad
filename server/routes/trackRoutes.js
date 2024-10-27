const express = require("express");
const router = express.Router();
const trackController = require("../controllers/trackController");

router.post("/add", trackController.addTrack);
router.delete("/delete/:track_id", trackController.deleteTrack);
router.put("/update/:track_id", trackController.updateTrack);
router.get("/album/:album_id", trackController.getTracksByAlbum);
router.get("/artist/:artist_id", trackController.getTracksByArtist);
router.get("/:track_id", trackController.getTrackByTrackId);
router.get("/rating/:track_id", trackController.getTrackRating);
router.put("/soft-delete/:track_id", trackController.softDeleteTrack);
router.put("/restore/:track_id", trackController.restoreTrack);
router.get("/soft-deleted/:track_id", trackController.getSoftDeletedTrack);
router.get("/title/:track_title", trackController.getTrackByTrackTitle);
router.get("/album-name/:album_name", trackController.getTracksByAlbumName);
router.get("/artist-name/:artist_name", trackController.getTracksByArtistName);

module.exports = router;