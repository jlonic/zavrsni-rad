const Review = require("../models/review");

const reviewArtist = async (req, res) => {
    try {
        const { user_id, artist_id, review_text, rating } = req.body;
        const newReview = await Review.reviewArtist(user_id, artist_id, review_text, rating);
        res.json(newReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding review to database"});
    }
};

const reviewAlbum = async (req, res) => {
    try {
        const { user_id, album_id, review_text, rating } = req.body;
        const newReview = await Review.reviewAlbum(user_id, album_id, review_text, rating);
        res.json(newReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding review to database"});
    }
};

const reviewTrack = async (req, res) => {
    try {
        const { user_id, track_id, review_text, rating } = req.body;
        const newReview = await Review.reviewTrack(user_id, track_id, review_text, rating);
        res.json(newReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding review to database"});
    }
};

const editReview = async (req, res) => {
    try {
        const { review_id, review_text, rating } = req.body;
        const editedReview = await Review.editReview(review_id, review_text, rating);
        res.json(editedReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error editing review in database"});
    }
};

const deleteReview = async (req, res) => {
    try {
        const { review_id } = req.body;
        const deletedReview = await Review.deleteReview(review_id);
        res.json(deletedReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting review from database"});
    }
};

const getArtistReviews = async (req, res) => {
    try {
        const { artist_id } = req.body;
        const artistReviews = await Review.getArtistReviews(artist_id);
        res.json(artistReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database"});
    }
};

const getAlbumReviews = async (req, res) => {
    try {
        const { album_id } = req.body;
        const albumReviews = await Review.getAlbumReviews(album_id);
        res.json(albumReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database"});
    }
};

const getTrackReviews = async (req, res) => {
    try {
        const { track_id } = req.body;
        const trackReviews = await Review.getTrackReviews(track_id);
        res.json(trackReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database"});
    }
};

module.exports = {
    reviewArtist,
    reviewAlbum,
    reviewTrack,
    editReview,
    deleteReview,
    getArtistReviews,
    getAlbumReviews,
    getTrackReviews,
}; 