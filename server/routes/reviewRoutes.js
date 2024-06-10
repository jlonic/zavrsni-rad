const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/reviewArtist", reviewController.reviewArtist);
router.post("/reviewAlbum", reviewController.reviewAlbum);
router.post("/reviewTrack", reviewController.reviewTrack);
router.put("/editReview", reviewController.editReview);
router.delete("/deleteReview", reviewController.deleteReview);
router.get("/artist/:artist_id", reviewController.getArtistReviews);
router.get("/album/:album_id", reviewController.getAlbumReviews);
router.get("/track/:track_id", reviewController.getTrackReviews);

module.exports = router;