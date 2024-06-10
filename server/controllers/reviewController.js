const Review = require("../models/review");
const jwt = require('jsonwebtoken');

const reviewArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { artist_id, review_text, rating } = req.body;
        const newReview = await Review.reviewArtist(user_id, artist_id, review_text, rating);
        res.json(newReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding review to database" });
    }
};

const reviewAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { album_id, review_text, rating } = req.body;
        const newReview = await Review.reviewAlbum(user_id, album_id, review_text, rating);
        res.json(newReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding review to database" });
    }
};

const reviewTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { track_id, review_text, rating } = req.body;
        const newReview = await Review.reviewTrack(user_id, track_id, review_text, rating);
        res.json(newReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding review to database" });
    }
};

const editReview = async (req, res) => { //test
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const { review_id, review_text, rating, edited_on } = req.body;
        const user_id = await Review.getUserIdFromReview(review_id);
        if ((user.role !== "administrator") || (user.role !== "moderator") || (user.user_id !== user_id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const editedReview = await Review.editReview(review_id, review_text, rating, edited_on);
        res.json(editedReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error editing review in database" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if ((user.role !== "administrator") || (user.role !== "moderator") || (user.user_id !== review.user_id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { review_id } = req.body;
        const deletedReview = await Review.deleteReview(review_id);
        res.json(deletedReview);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting review from database" });
    }
};

const getArtistReviews = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const artistReviews = await Review.getArtistReviews(artist_id);
        res.json(artistReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getAlbumReviews = async (req, res) => {
    try {
        const { album_id } = req.params;
        const albumReviews = await Review.getAlbumReviews(album_id);
        res.json(albumReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getTrackReviews = async (req, res) => {
    try {
        const { track_id } = req.params;
        const trackReviews = await Review.getTrackReviews(track_id);
        res.json(trackReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
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