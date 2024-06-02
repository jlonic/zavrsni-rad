const pool = require("../config/db");

const reviewArtist = async (user_id, artist_id, review_text, rating) => {
    const newReview = await pool.query(
        "INSERT INTO reviews (user_id, artist_id, review_text, rating) VALUES($1, $2, $3, $4) RETURNING *",
        [user_id, artist_id, review_text, rating]);    
    return newReview.rows;
};

const reviewAlbum = async (user_id, album_id, review_text, rating) => {
    const newReview = await pool.query(
        "INSERT INTO reviews (user_id, album_id, review_text, rating) VALUES($1, $2, $3, $4) RETURNING *",
        [user_id, album_id, review_text, rating]);    
    return newReview.rows;
};

const reviewTrack = async (user_id, track_id, review_text, rating) => {
    const newReview = await pool.query(
        "INSERT INTO reviews (user_id, track_id, review_text, rating) VALUES($1, $2, $3, $4) RETURNING *",
        [user_id, track_id, review_text, rating]);    
    return newReview.rows;
};

const editReview = async (review_id, review_text, rating) => {
    const editedReview = await pool.query(
        "UPDATE reviews SET review_text = $1, rating = $2 WHERE review_id = $3 RETURNING *",
        [review_text, rating, review_id]);
    return editedReview.rows;
};

const deleteReview = async (review_id) => {
    const deletedReview = await pool.query(
        "DELETE FROM reviews WHERE review_id = $1 RETURNING *",
        [review_id]);
    return deletedReview.rows;
};

const getArtistReviews = async (artist_id) => {
    const artistReviews = await pool.query(
        "SELECT * FROM reviews WHERE artist_id = $1",
        [artist_id]);
    return artistReviews.rows;
};

const getAlbumReviews = async (album_id) => {
    const albumReviews = await pool.query(
        "SELECT * FROM reviews WHERE album_id = $1",
        [album_id]);
    return albumReviews.rows;
};

const getTrackReviews = async (track_id) => {
    const trackReviews = await pool.query(
        "SELECT * FROM reviews WHERE track_id = $1",
        [track_id]);
    return trackReviews.rows;
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