const pool = require("../config/db");

const addTrack = async (album_id, track_title, duration, track_number) => {
    const newTrack = await pool.query(
        "INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES($1, $2, $3, $4) RETURNING *",
        [album_id, track_title, duration, track_number]);
    return newTrack.rows;
};

const updateTrack = async (track_id, album_id, track_title, duration, track_number) => {
    const updatedTrack = await pool.query(
        "UPDATE tracks SET album_id = $1, track_title = $2, duration = $3, track_number = $4 WHERE track_id = $5 RETURNING *",
        [album_id, track_title, duration, track_number, track_id]);
    return updatedTrack.rows;
};

const getTracksByAlbum = async (album_id) => {
    const tracks = await pool.query(
        "SELECT t.*, al.album_title, al.cover_image, a.artist_name, a.artist_image FROM tracks t INNER JOIN albums al on t.album_id = al.album_id INNER JOIN artists a on al.artist_id = a.artist_id WHERE t.album_id = $1",
        [album_id]);
    return tracks.rows;
};

const getTracksByArtist = async (artist_id) => {
    const tracks = await pool.query(
        "SELECT tr.*, art.artist_image, art.artist_name FROM tracks tr INNER JOIN albums alb ON tr.album_id = alb.album_id INNER JOIN artists art ON alb.artist_id = art.artist_id WHERE art.artist_id = $1",
        [artist_id]);
    return tracks.rows;
};

const getTrackByTrackId = async (track_id) => {
    const track = await pool.query(
        "SELECT t.*, a.cover_image, a.album_title, art.artist_name FROM tracks t INNER JOIN albums a ON t.album_id = a.album_id INNER JOIN artists art ON a.artist_id = art.artist_id WHERE t.track_id = $1 AND t.is_deleted != TRUE",
        [track_id]);
    return track.rows;
};

const getTrackRating = async (track_id) => {
    const trackRating = await pool.query(
        "SELECT AVG(rating) AS track_rating FROM reviews WHERE track_id = $1",
        [track_id]);
    return trackRating.rows;
};

const softDeleteTrack = async (track_id) => {
    await pool.query(
        "UPDATE favorites SET is_deleted = TRUE WHERE track_id = $1",
        [track_id]);
    await pool.query(
        "UPDATE reviews SET is_deleted = TRUE WHERE track_id = $1",
        [track_id]);
    const softDeleteTrack = await pool.query(
        "UPDATE tracks SET is_deleted = TRUE WHERE track_id = $1",
        [track_id]);
    return softDeleteTrack.rows;
};

const restoreTrack = async (track_id) => {
    await pool.query(
        "UPDATE favorites SET is_deleted = FALSE WHERE track_id = $1",
        [track_id]);
    await pool.query(
        "UPDATE reviews SET is_deleted = FALSE WHERE track_id = $1",
        [track_id]);
    const restoreTrack = await pool.query(
        "UPDATE tracks SET is_deleted = FALSE WHERE track_id = $1",
        [track_id]);
    return restoreTrack.rows;
};

const deleteTrack = async (track_id) => {
    await pool.query(
        "DELETE FROM favorites WHERE track_id = $1",
        [track_id]);
    await pool.query(
        "DELETE FROM reviews WHERE track_id = $1",
        [track_id]);
    const deletedTrack = await pool.query(
        "DELETE FROM tracks WHERE track_id = $1 RETURNING *",
        [track_id]);
    return deletedTrack.rows;
};

const getSoftDeletedTrack = async (track_id) => {
    const track = await pool.query(
        "SELECT t.*, a.cover_image, a.album_title, art.artist_name FROM tracks t INNER JOIN albums a ON t.album_id = a.album_id INNER JOIN artists art ON a.artist_id = art.artist_id WHERE t.track_id = $1 AND t.is_deleted = TRUE",
        [track_id]);
    return track.rows;
};

const getTrackByTrackTitle = async (track_title) => {
    const searchQuery = `%${track_title}%`;
    const track = await pool.query(
        "SELECT t.*, a.cover_image, a.album_title, art.artist_name FROM tracks t INNER JOIN albums a ON t.album_id = a.album_id INNER JOIN artists art ON a.artist_id = art.artist_id WHERE t.track_title ILIKE $1",
        [searchQuery]);
    return track.rows;
};

const getTracksByAlbumName = async (album_name) => {
    const tracks = await pool.query(
        "SELECT t.*, al.album_title, al.cover_image, al.album_id, a.artist_name, a.artist_image, a.artist_id FROM tracks t INNER JOIN albums al on t.album_id = al.album_id INNER JOIN artists a on al.artist_id = a.artist_id WHERE al.album_title ILIKE $1",
        [album_name]);
    return tracks.rows;
};

const getTracksByArtistName = async (artist_name) => {
    const tracks = await pool.query(
        "SELECT tr.*, art.artist_id, art.artist_image, art.artist_name FROM tracks tr INNER JOIN albums alb ON tr.album_id = alb.album_id INNER JOIN artists art ON alb.artist_id = art.artist_id WHERE art.artist_name ILIKE $1",
        [artist_name]);
    return tracks.rows;
};


module.exports = {
    addTrack,
    deleteTrack,
    updateTrack,
    getTracksByAlbum,
    getTracksByArtist,
    getTrackByTrackId,
    getTrackRating,
    softDeleteTrack,
    restoreTrack,
    getSoftDeletedTrack,
    getTrackByTrackTitle,
    getTracksByAlbumName,
    getTracksByArtistName
};