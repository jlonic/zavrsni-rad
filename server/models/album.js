const pool = require("../config/db");

const addAlbum = async (album_title, artist_id, release_date) => {
    const newAlbum = await pool.query(
        "INSERT INTO albums (album_title, artist_id, release_date) VALUES($1, $2, $3) RETURNING *",
        [album_title, artist_id, release_date]);
    return newAlbum.rows;
};

const getAlbumsByArtist = async (artist_id) => {
    const albums = await pool.query(
        "SELECT * FROM albums WHERE artist_id = $1", 
        [artist_id]);
    return albums.rows;
};

//const updateAlbum 

const deleteAlbum = async (album_id) => {
    const deletedAlbum = await pool.query(
        "DELETE FROM albums WHERE album_id = $1 RETURNING *", 
        [album_id]);
    return deletedAlbum.rows;
};

module.exports = {
    addAlbum,
    getAlbumsByArtist,
    //updateAlbum,
    deleteAlbum,
};