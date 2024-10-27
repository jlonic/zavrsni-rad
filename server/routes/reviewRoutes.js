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
router.get("/top5AverageRatingArtists", reviewController.getTop5AverageRatingArtists);
router.get("/top5MostReviewedArtists", reviewController.getTop5MostReviewedArtists);
router.get("/latest5RevievedArtists", reviewController.getLatest5ReviewedArtists);
router.get("/top5AverageRatingAlbums", reviewController.getTop5AverageRatingAlbums);
router.get("/top5MostReviewedAlbums", reviewController.getTop5MostReviewedAlbums);
router.get("/latest5RevievedAlbums", reviewController.getLatest5ReviewedAlbums);
router.get("/top5AverageRatingTracks", reviewController.getTop5AverageRatingTracks);
router.get("/top5MostReviewedTracks", reviewController.getTop5MostReviewedTracks);
router.get("/latest5RevievedTracks", reviewController.getLatest5ReviewedTracks);
router.get("/artist-reviews/:username", reviewController.getArtistReviewsByUser);
router.get("/album-reviews/:username", reviewController.getAlbumReviewsByUser);
router.get("/track-reviews/:username", reviewController.getTrackReviewsByUser);


module.exports = router;