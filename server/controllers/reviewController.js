const Review = require("../models/review");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const reviewArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { artist_id, review_text, rating } = req.body;
        const existingReviews = await Review.getExistingArtistReview(user_id, artist_id);
        const hasRating = existingReviews.some(review => review.rating !== null);

        if (hasRating || rating === 0) { //allows user to add a review without rating if they have already rated the artist
            let newReview = await Review.reviewArtist(user_id, artist_id, review_text, null);
            return res.json(newReview);
        }

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

        const existingReviews = await Review.getExistingAlbumReview(user_id, album_id);
        const hasRating = existingReviews.some(review => review.rating !== null);

        if (hasRating) { //allows user to add a review without rating if they have already rated the album
            let newReview = await Review.reviewAlbum(user_id, album_id, review_text, null);
            return res.json(newReview);
        }

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
        
        const existingReviews = await Review.getExistingTrackReview(user_id, track_id);
        const hasRating = existingReviews.some(review => review.rating !== null);

        if (hasRating) { //allows user to add a review without rating if they have already rated the track
            let newReview = await Review.reviewTrack(user_id, track_id, review_text, null);
            return res.json(newReview);
        }

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
        if (user.user_role !== 'administrator' && user.user_role !== 'moderator' && user_id !== user.user_id) {
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

        const existingUser = await User.getUserById(user.user_id);
        if (existingUser.ok) {
            if (user.user_role !== 'administrator' && user.user_role !== 'moderator' && existingUser.user_id !== user.user_id) {
                return res.status(403).json({ message: "Unauthorized" });
            }

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

const getTop5AverageRatingArtists = async (_, res) => {
    try {
        const top5AverageRatingArtists = await Review.getTop5AverageRatingArtists();
        res.json(top5AverageRatingArtists);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getTop5MostReviewedArtists = async (_, res) => {
    try {
        const top5MostReviewedArtists = await Review.getTop5MostReviewedArtists();
        res.json(top5MostReviewedArtists);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getLatest5ReviewedArtists = async (_, res) => {
    try {
        const latest5ReviewedArtists = await Review.getLatest5ReviewedArtists();
        res.json(latest5ReviewedArtists);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getTop5AverageRatingAlbums = async (_, res) => {
    try {
        const top5AverageRatingAlbums = await Review.getTop5AverageRatingAlbums();
        res.json(top5AverageRatingAlbums);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getTop5MostReviewedAlbums = async (_, res) => {
    try {
        const top5MostReviewedAlbums = await Review.getTop5MostReviewedAlbums();
        res.json(top5MostReviewedAlbums);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};
const getLatest5ReviewedAlbums = async (_, res) => {
    try {
        const latest5ReviewedAlbums = await Review.getLatest5ReviewedAlbums();
        res.json(latest5ReviewedAlbums);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getTop5AverageRatingTracks = async (_, res) => {
    try {
        const top5AverageRatingTracks = await Review.getTop5AverageRatingTracks();
        res.json(top5AverageRatingTracks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getTop5MostReviewedTracks = async (_, res) => {
    try {
        const top5MostReviewedTracks = await Review.getTop5MostReviewedTracks();
        res.json(top5MostReviewedTracks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getLatest5ReviewedTracks = async (_, res) => {
    try {
        const latest5ReviewedTracks = await Review.getLatest5ReviewedTracks();
        res.json(latest5ReviewedTracks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching reviews from database" });
    }
};

const getArtistReviewsByUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { username } = req.params;
        const user = await User.getUserByUsername(username);
        const artistReviews = await Review.getArtistReviewsByUser(user[0].user_id);
        res.json(artistReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting reviews from database" });
    }
};

const getAlbumReviewsByUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { username } = req.params;
        const user = await User.getUserByUsername(username);
        const albumReviews = await Review.getAlbumReviewsByUser(user[0].user_id);
        res.json(albumReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting reviews from database" });
    }
};

const getTrackReviewsByUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { username } = req.params;
        const user = await User.getUserByUsername(username);
        const trackReviews = await Review.getTrackReviewsByUser(user[0].user_id);
        res.json(trackReviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting reviews from database" });
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
    getTop5AverageRatingArtists,
    getTop5MostReviewedArtists,
    getLatest5ReviewedArtists,
    getTop5AverageRatingAlbums,
    getTop5MostReviewedAlbums,
    getLatest5ReviewedAlbums,
    getTop5AverageRatingTracks,
    getTop5MostReviewedTracks,
    getLatest5ReviewedTracks,
    getArtistReviewsByUser,
    getAlbumReviewsByUser,
    getTrackReviewsByUser
}; 