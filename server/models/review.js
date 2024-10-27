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

const editReview = async (review_id, review_text, rating, edited_on) => {
    const editedReview = await pool.query(
        "UPDATE reviews SET review_text = $1, rating = $2, edited_on = $3, WHERE review_id = $4 RETURNING *",
        [review_text, rating, edited_on, review_id]);
    return editedReview.rows;
};

const deleteReview = async (review_id) => {
    await pool.query(
        "DELETE FROM reports WHERE review_id = $1",
        [review_id]);
    const deletedReview = await pool.query(
        "DELETE FROM reviews WHERE review_id = $1 RETURNING *",
        [review_id]);
    return deletedReview.rows;
};

const getArtistReviews = async (artist_id) => {
    const artistReviews = await pool.query(
        "SELECT r.*, u.username, u.profile_picture FROM reviews r INNER JOIN users u on u.user_id = r.user_id WHERE artist_id = $1",
        [artist_id]);
    return artistReviews.rows;
};

const getAlbumReviews = async (album_id) => {
    const albumReviews = await pool.query(
        "SELECT r.*, u.username, u.profile_picture FROM reviews r INNER JOIN users u on u.user_id = r.user_id WHERE album_id = $1",
        [album_id]);
    return albumReviews.rows;
};

const getTrackReviews = async (track_id) => {
    const trackReviews = await pool.query(
        "SELECT r.*, u.username, u.profile_picture FROM reviews r INNER JOIN users u on u.user_id = r.user_id WHERE track_id = $1",
        [track_id]);
    return trackReviews.rows;
};

const getUserIdFromReview = async (review_id) => {
    const user_id = await pool.query(
        "SELECT user_id FROM reviews WHERE review_id = $1",
        [review_id]);
    return user_id.rows[0].user_id;
};

const getTop5AverageRatingArtists = async () => {
    const top5AverageRatingArtists = await pool.query(
        "SELECT a.artist_id, a.artist_name, a.artist_image, AVG(r.rating) as average_rating FROM reviews r INNER JOIN artists a ON a.artist_id = r.artist_id GROUP BY a.artist_id, a.artist_name, a.artist_image ORDER BY average_rating DESC LIMIT 5"
    );
    return top5AverageRatingArtists.rows;
};
const getTop5MostReviewedArtists = async () => {
    const top5MostReviewedArtists = await pool.query(
        "SELECT a.artist_id, a.artist_name, a.artist_image, COUNT(r.review_id) as number_of_reviews FROM reviews r INNER JOIN artists a ON a.artist_id = r.artist_id GROUP BY a.artist_id, a.artist_name, a.artist_image ORDER BY number_of_reviews DESC LIMIT 5"
    );
    return top5MostReviewedArtists.rows;
};

const getLatest5ReviewedArtists = async () => {
    const latest5ReviewedArtists = await pool.query(
        "SELECT a.artist_id, a.artist_name, a.artist_image, r.review_date, r.review_text FROM (SELECT DISTINCT ON (r.artist_id) r.artist_id, r.review_date, r.review_text FROM reviews r ORDER BY r.artist_id, r.review_date DESC) r INNER JOIN artists a ON a.artist_id = r.artist_id ORDER BY r.review_date DESC LIMIT 5"
    );
    return latest5ReviewedArtists.rows;
};

const getTop5AverageRatingAlbums = async () => {
    const top5AverageRatingAlbums = await pool.query(
        "SELECT al.album_id, al.album_title, al.cover_image, AVG(r.rating) as average_rating FROM reviews r INNER JOIN albums al ON al.album_id = r.album_id GROUP BY al.album_id, al.album_title, al.cover_image ORDER BY average_rating DESC LIMIT 5"
    );
    return top5AverageRatingAlbums.rows;
};

const getTop5MostReviewedAlbums = async () => {
    const top5MostReviewedAlbums = await pool.query(
        "SELECT al.album_id, al.album_title, al.cover_image, COUNT(r.review_id) as number_of_reviews FROM reviews r INNER JOIN albums al ON al.album_id = r.album_id GROUP BY al.album_id, al.album_title, al.cover_image ORDER BY number_of_reviews DESC LIMIT 5"
    );
    return top5MostReviewedAlbums.rows;
};

const getLatest5ReviewedAlbums = async () => {
    const latest5ReviewedAlbums = await pool.query(
        "SELECT al.album_id, al.album_title, al.cover_image, r.review_date, r.review_text FROM (SELECT DISTINCT ON (r.album_id) r.album_id, r.review_date, r.review_text FROM reviews r ORDER BY r.album_id, r.review_date DESC) r INNER JOIN albums al ON al.album_id = r.album_id ORDER BY r.review_date DESC LIMIT 5"
    );
    return latest5ReviewedAlbums.rows;
};

const getTop5AverageRatingTracks = async () => {
    const top5AverageRatingTracks = await pool.query(
        "SELECT t.track_id, t.track_title, a.cover_image, AVG(r.rating) as average_rating FROM reviews r INNER JOIN tracks t ON t.track_id = r.track_id INNER JOIN albums a on t.album_id = a.album_id GROUP BY t.track_id, t.track_title, a.cover_image ORDER BY average_rating DESC LIMIT 5"
    );
    return top5AverageRatingTracks.rows;
};

const getTop5MostReviewedTracks = async () => {
    const top5MostReviewedTracks = await pool.query(
        "SELECT t.track_id, t.track_title, a.cover_image, COUNT(r.review_id) as number_of_reviews FROM reviews r INNER JOIN tracks t ON t.track_id = r.track_id INNER JOIN albums a on t.album_id = a.album_id GROUP BY t.track_id, t.track_title, a.cover_image ORDER BY number_of_reviews DESC LIMIT 5"
    );
    return top5MostReviewedTracks.rows;
};

const getLatest5ReviewedTracks = async () => {
    const latest5ReviewedTracks = await pool.query(
        "SELECT t.track_id, t.track_title, r.review_date, r.review_text, a.cover_image FROM (SELECT DISTINCT ON (r.track_id) r.track_id, r.review_date, r.review_text FROM reviews r ORDER BY r.track_id, r.review_date DESC) r INNER JOIN tracks t ON t.track_id = r.track_id INNER JOIN albums a ON t.album_id = a.album_id ORDER BY r.review_date DESC LIMIT 5"
    );
    return latest5ReviewedTracks.rows;
};

const getArtistReviewsByUser = async (user_id) => {
    const artistReviewsByUser = await pool.query(
        "SELECT u.username, u.profile_picture, r.*, a.artist_name, a.artist_image FROM reviews r INNER JOIN artists a on a.artist_id = r.artist_id INNER JOIN users u ON u.user_id = r.user_id WHERE r.user_id = $1 ORDER BY r.review_date DESC",
        [user_id]);
    return artistReviewsByUser.rows;
};

const getAlbumReviewsByUser = async (user_id) => {
    const albumReviewsByUser = await pool.query(
        "SELECT u.username, u.profile_picture, r.*, al.album_title, al.cover_image FROM reviews r INNER JOIN albums al on al.album_id = r.album_id INNER JOIN users u ON u.user_id = r.user_id WHERE r.user_id = $1 ORDER BY r.review_date DESC",
        [user_id]);
    return albumReviewsByUser.rows;
};

const getTrackReviewsByUser = async (user_id) => {
    const trackReviewsByUser = await pool.query(
        "SELECT u.username, u.profile_picture, r.*, t.track_title, a.cover_image FROM reviews r INNER JOIN tracks t on t.track_id = r.track_id INNER JOIN albums a on t.album_id = a.album_id INNER JOIN users u ON u.user_id = r.user_id WHERE r.user_id = $1 ORDER BY r.review_date DESC",
        [user_id]);
    return trackReviewsByUser.rows;
};

const getExistingArtistReview = async (user_id, artist_id) => {
    const review = await pool.query(
        "SELECT * FROM reviews WHERE user_id = $1 AND artist_id = $2",
        [user_id, artist_id]);
    return review.rows;
};

const getExistingAlbumReview = async (user_id, album_id) => {
    const review = await pool.query(
        "SELECT * FROM reviews WHERE user_id = $1 AND album_id = $2",
        [user_id, album_id]);
    return review.rows;
};

const getExistingTrackReview = async (user_id, track_id) => {
    const review = await pool.query(
        "SELECT * FROM reviews WHERE user_id = $1 AND track_id = $2",
        [user_id, track_id]);
    return review.rows;
}

module.exports = {
    reviewArtist,
    reviewAlbum,
    reviewTrack,
    editReview,
    deleteReview,
    getArtistReviews,
    getAlbumReviews,
    getTrackReviews,
    getUserIdFromReview,
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
    getTrackReviewsByUser,
    getExistingArtistReview,
    getExistingAlbumReview,
    getExistingTrackReview
};