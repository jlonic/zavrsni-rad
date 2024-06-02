const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/reviewArtist", reviewController.reviewArtist);
router.post("/reviewAlbum", reviewController.reviewAlbum);
router.post("/reviewTrack", reviewController.reviewTrack);
router.put("/editReview", reviewController.editReview);
router.delete("/deleteReview", reviewController.deleteReview);
router.get("/getArtistReviews", reviewController.getArtistReviews);
router.get("/getAlbumReviews", reviewController.getAlbumReviews);
router.get("/getTrackReviews", reviewController.getTrackReviews);

module.exports = router;