const express = require("express");
const router = express.Router();
const trackController = require("../controllers/trackController");

router.post("/add", trackController.addTrack);
router.delete("/delete/:track_id", trackController.deleteTrack);
//router.put("/update/:track_id", trackController.updateTrack);
router.get("/album/:album_id", trackController.getTracksByAlbum);
router.get("/artist/:artist_id", trackController.getTracksByArtist);



module.exports = router;