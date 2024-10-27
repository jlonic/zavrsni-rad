const pool = require("../config/db");

const addAlbum = async (album_title, artist_id, release_date, cover_image, record_type, album_info) => {
    const newAlbum = await pool.query(
        "INSERT INTO albums (album_title, artist_id, release_date, cover_image, record_type, album_info) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [album_title, artist_id, release_date, cover_image, record_type, album_info]);
    return newAlbum.rows;
};

const getAlbumsByArtist = async (artist_id) => {
    const albums = await pool.query(
        "SELECT * FROM albums WHERE artist_id = $1",
        [artist_id]);
    return albums.rows;
};

const updateAlbum = async (album_id, album_title, artist_id, release_date, cover_image, record_type, album_info) => {
    const updatedAlbum = await pool.query(
        "UPDATE albums SET album_title = $2, artist_id = $3, release_date = $4, cover_image = $5, record_type = $6, album_info =$7 WHERE album_id = $1 RETURNING *",
        [album_id, album_title, artist_id, release_date, cover_image, record_type, album_info]);
    return updatedAlbum.rows;
};

const getAlbumByAlbumId = async (album_id) => {
    const album = await pool.query(
        "SELECT * FROM albums WHERE album_id = $1 AND is_deleted != TRUE",
        [album_id]);
    return album.rows;
};

const getAlbumByTitle = async (album_title) => {
    const searchQuery = `%${album_title}%`;
    const album = await pool.query(
        "SELECT * FROM albums WHERE album_title ILIKE $1",
        [searchQuery]);
    return album.rows;
};

const getAllAlbums = async (limit, offset) => {
    const allAlbums = await pool.query(
        "SELECT al.*, a.artist_name FROM albums al INNER JOIN artists a ON al.artist_id = a.artist_id LIMIT $1 OFFSET $2",
        [limit, offset]
    );
    return allAlbums.rows;
};

const getAlbumsandartistname = async () => {
    const allAlbums = await pool.query(
        "SELECT albums.album_id, albums.album_title, artists.artist_name FROM albums INNER JOIN artists ON albums.artist_id = artists.artist_id");
    return allAlbums.rows;

};

const getAlbumRating = async (album_id) => {
    const albumRating = await pool.query(
        "SELECT AVG(rating) AS album_rating FROM reviews WHERE album_id = $1",
        [album_id]);
    return albumRating.rows;
};

const softDeleteAlbum = async (album_id) => {
    await pool.query(
        "UPDATE favorites SET is_deleted = TRUE WHERE album_id = $1",
        [album_id]);
    await pool.query(
        "UPDATE reviews SET is_deleted = TRUE WHERE album_id = $1",
        [album_id]);
    await pool.query(
        "UPDATE reviews r SET is_deleted = TRUE FROM tracks t INNER JOIN albums a ON t.album_id = a.album_id WHERE r.track_id = t.track_id AND a.album_id = $1",
        [album_id]);
    await pool.query(
        "UPDATE tracks SET is_deleted = TRUE WHERE album_id = $1",
        [album_id]);
    const softDeleteAlbum = await pool.query(
        "UPDATE albums SET is_deleted = TRUE WHERE album_id = $1",
        [album_id]);
    return softDeleteAlbum.rows;
};

const restoreAlbum = async (album_id) => {
    await pool.query(
        "UPDATE favorites SET is_deleted = FALSE WHERE album_id = $1",
        [album_id]);
    await pool.query(
        "UPDATE reviews SET is_deleted = FALSE WHERE album_id = $1",
        [album_id]);
    await pool.query(
        "UPDATE reviews r SET is_deleted = FALSE FROM tracks t INNER JOIN albums a ON t.album_id = a.album_id WHERE r.track_id = t.track_id AND a.album_id = $1",
        [album_id]);
    await pool.query(
        "UPDATE tracks SET is_deleted = FALSE WHERE album_id = $1",
        [album_id]);
    const restoreAlbum = await pool.query(
        "UPDATE albums SET is_deleted = FALSE WHERE album_id = $1",
        [album_id]);
    return restoreAlbum.rows;
};

const deleteAllAlbumData = async (album_id) => {
    await pool.query(
        "DELETE FROM favorites WHERE album_id = $1",
        [album_id]);
    await pool.query(
        "DELETE FROM reviews WHERE album_id = $1",
        [album_id]);
    await pool.query(
        "DELETE FROM reviews WHERE track_id IN (SELECT t.track_id FROM tracks t WHERE t.album_id = $1)",
        [album_id]);
    await pool.query(
        "DELETE FROM tracks WHERE album_id = $1",
        [album_id]);
    const deleteAlbum = await pool.query(
        "DELETE FROM albums WHERE album_id = $1",
        [album_id]);
    return deleteAlbum.rows;
};

// const getSoftDeletedAlbum = async (album_title) => {
//     const searchQuery = `%${album_title}%`;
//     const album = await pool.query(
//         "SELECT * FROM albums WHERE album_title ILIKE $1 AND is_deleted = TRUE",
//         [searchQuery]);
//     return album.rows;
// };

const getAlbumsByArtistName = async (artist_name) => {
    const searchQuery = `%${artist_name}%`;
    const album = await pool.query(
        "SELECT al.* FROM albums al INNER JOIN artists a ON al.artist_id = a.artist_id WHERE a.artist_name ILIKE $1",
        [searchQuery]);
    return album.rows;
};

module.exports = {
    addAlbum,
    getAlbumsByArtist,
    updateAlbum,
    getAlbumByAlbumId,
    getAllAlbums,
    getAlbumsandartistname,
    getAlbumRating,
    softDeleteAlbum,
    restoreAlbum,
    deleteAllAlbumData,
    // getSoftDeletedAlbum,
    getAlbumByTitle,
    getAlbumsByArtistName
};