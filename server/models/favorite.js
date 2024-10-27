const pool = require("../config/db");
const User = require("./user");

const addFavoriteAlbum = async (user_id, album_id) => {
    const newFavorite = await pool.query(
        "INSERT INTO favorites (user_id, album_id) VALUES($1, $2) RETURNING *",
        [user_id, album_id]);
    return newFavorite.rows;
};

const removeFavoriteAlbum = async (user_id, album_id) => {
    const deletedFavorite = await pool.query(
        "DELETE FROM favorites WHERE user_id = $1 AND album_id = $2 RETURNING *",
        [user_id, album_id]);
    return deletedFavorite.rows;
};

const addFavoriteTrack = async (user_id, track_id) => {
    const newFavorite = await pool.query(
        "INSERT INTO favorites (user_id, track_id) VALUES($1, $2) RETURNING *",
        [user_id, track_id]);
    return newFavorite.rows;
};

const removeFavoriteTrack = async (user_id, track_id) => {
    const deletedFavorite = await pool.query(
        "DELETE FROM favorites WHERE user_id = $1 AND track_id = $2 RETURNING *",
        [user_id, track_id]);
    return deletedFavorite.rows;
};

const checkFavoriteAlbumStatus = async (user_id, album_id) => {
    const favorite = await pool.query(
        "SELECT * FROM favorites WHERE user_id = $1 AND album_id = $2",
        [user_id, album_id]);
    return favorite.rows;
};

const checkFavoriteTrackStatus = async (user_id, track_id) => {
    const favorite = await pool.query(
        "SELECT * FROM favorites WHERE user_id = $1 AND track_id = $2",
        [user_id, track_id]);
    return favorite.rows;
};

const getUserFavoriteAlbums = async (username) => {
    const user = await User.getUserByUsername(username);
    const favoriteAlbums = await pool.query(
        "SELECT a.*, f.favorite_id FROM favorites f INNER JOIN albums a on f.album_id = a.album_id WHERE user_id = $1",
        [user[0].user_id]);
    return favoriteAlbums.rows;
};

const getUserFavoriteTracks = async (username) => {
    const user = await User.getUserByUsername(username);
    const favoriteTracks = await pool.query(
        "SELECT t.*, a.cover_image, f.favorite_id FROM favorites f INNER JOIN tracks t on f.track_id = t.track_id INNER JOIN albums a ON a.album_id = t.album_id WHERE user_id = $1",
        [user[0].user_id]);
    return favoriteTracks.rows;
};
module.exports = {
    addFavoriteAlbum,
    removeFavoriteAlbum,
    addFavoriteTrack,
    removeFavoriteTrack,
    checkFavoriteAlbumStatus,
    checkFavoriteTrackStatus,
    getUserFavoriteAlbums,
    getUserFavoriteTracks
};