const pool = require("../config/db");

const getAllArtists = async () => {
    const allArtists = await pool.query(
        "SELECT * FROM artists");
    return allArtists.rows;
};

const addArtist = async (artist_name, artist_image, artist_info) => {
    const newArtist = await pool.query(
        "INSERT INTO artists (artist_name, artist_image, artist_info) VALUES ($1, $2, $3)",
        [artist_name, artist_image, artist_info]);
    return newArtist.rows;
};

const getArtist = async (artist_id) => {
    const artist = await pool.query(
        "SELECT * FROM artists WHERE artist_id = $1 AND is_deleted != TRUE",
        [artist_id]);
    return artist.rows;
};

const updateArtist = async (artist_id, artist_name, artist_image, artist_info) => { 
    const updatedArtist = await pool.query(
        "UPDATE artists SET artist_name = $2, artist_image = $3, artist_info = $4 WHERE artist_id = $1 RETURNING *",
        [artist_id, artist_name, artist_image, artist_info]);
    return updatedArtist.rows;
};

const getArtistRating = async (artist_id) => {
    const artistRating = await pool.query(
        "SELECT AVG(rating) AS artist_rating FROM reviews WHERE artist_id = $1",
        [artist_id]);
    return artistRating.rows;
};

const softDeleteArtist = async (artist_id) => {
    await pool.query(
        "UPDATE reviews SET is_deleted = TRUE WHERE artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE follow_artists SET is_deleted = TRUE WHERE artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE reviews r SET is_deleted = TRUE FROM tracks t INNER JOIN albums al ON t.album_id = al.album_id INNER JOIN artists a ON al.artist_id = a.artist_id WHERE r.track_id = t.track_id AND a.artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE tracks t SET is_deleted = TRUE FROM albums al INNER JOIN artists a ON a.artist_id = al.artist_id WHERE t.album_id = al.album_id AND a.artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE reviews r SET is_deleted = TRUE FROM albums a WHERE r.album_id = a.album_id AND a.artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE albums SET is_deleted = TRUE WHERE artist_id = $1",
        [artist_id]);
    const softDeleteArtist = await pool.query(
        "UPDATE artists SET is_deleted = TRUE WHERE artist_id = $1",
        [artist_id]);
    return softDeleteArtist.rows;
};

const restoreArtist = async (artist_id) => {
    await pool.query(
        "UPDATE reviews SET is_deleted = FALSE WHERE artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE follow_artists SET is_deleted = FALSE WHERE artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE reviews r SET is_deleted = FALSE FROM tracks t INNER JOIN albums al ON t.album_id = al.album_id INNER JOIN artists a ON al.artist_id = a.artist_id WHERE r.track_id = t.track_id AND a.artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE tracks t SET is_deleted = FALSE FROM albums al INNER JOIN artists a ON a.artist_id = al.artist_id WHERE t.album_id = al.album_id AND a.artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE reviews r SET is_deleted = FALSE FROM albums a WHERE r.album_id = a.album_id AND a.artist_id = $1",
        [artist_id]);
    await pool.query(
        "UPDATE albums SET is_deleted = FALSE WHERE artist_id = $1",
        [artist_id]);
    const restoreArtist = await pool.query(
        "UPDATE artists SET is_deleted = FALSE WHERE artist_id = $1",
        [artist_id]);
    return restoreArtist.rows;
};

const deleteAllArtistData = async (artist_id) => {
    await pool.query(
        "DELETE FROM reviews WHERE artist_id = $1",
        [artist_id]);
    await pool.query(
        "DELETE FROM follow_artists WHERE artist_id = $1",
        [artist_id]);
    await pool.query(
        "DELETE FROM reviews WHERE track_id IN (SELECT t.track_id FROM tracks t INNER JOIN albums al ON t.album_id = al.album_id WHERE al.artist_id = $1)",
        [artist_id]);
    await pool.query(
        "DELETE FROM tracks WHERE album_id IN (SELECT album_id FROM albums WHERE artist_id = $1)",
        [artist_id]);
    await pool.query(
        "DELETE FROM reviews USING albums a WHERE reviews.album_id = a.album_id AND a.artist_id = $1",
        [artist_id]);
    await pool.query(
        "DELETE FROM albums WHERE artist_id = $1",
        [artist_id]);
    const deleteArtist = await pool.query(
        "DELETE FROM artists WHERE artist_id = $1",
        [artist_id]);
    return deleteArtist.rows;
};

const getArtistByName = async (artist_name) => {
    const searchQuery = `%${artist_name}%`;
    const artist = await pool.query(
        "SELECT * FROM artists WHERE artist_name ILIKE $1",
        [searchQuery]);
    return artist.rows;
};

const getAllSoftDeletedArtists = async () => {
    const allSoftDeletedArtists = await pool.query(
        "SELECT * FROM artists WHERE is_deleted = TRUE");
    return allSoftDeletedArtists.rows;
};

const getSoftDeletedArtist = async (artist_id) => {
    const softDeletedArtist = await pool.query(
        "SELECT * FROM artists WHERE artist_id = $1 AND is_deleted = TRUE",
        [artist_id]);
    return softDeletedArtist.rows;
};

module.exports = {
    getAllArtists,
    addArtist,
    updateArtist,
    getArtist,
    getArtistRating,
    deleteAllArtistData,
    softDeleteArtist,
    restoreArtist,
    getArtistByName,
    getAllSoftDeletedArtists,
    getSoftDeletedArtist
};