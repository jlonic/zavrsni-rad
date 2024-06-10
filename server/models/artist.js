const pool = require("../config/db");

const getAllArtists = async () => {
    const allArtists = await pool.query(
        "SELECT * FROM artists");
    return allArtists.rows;
};

const addArtist = async (artist_name, artist_image) => {
    const newArtist = await pool.query(
        "INSERT INTO artists (artist_name, artist_image) VALUES ($1, $2) RETURNING",
        [artist_name, artist_image]);
    return newArtist.rows;
};

const deleteArtist = async (artist_id) => {
    const deletedArtist = await pool.query(
        "DELETE FROM artists WHERE artist_id = $1",
        [artist_id]);
    return deletedArtist.rows;
};

const getArtist = async (artist_id) => {
    const artist = await pool.query(
        "SELECT * FROM artists WHERE artist_id = $1",
        [artist_id]);
    return artist.rows;
};

const updateArtist = async (artist_id, artist_name) => { //add more after db update
    const updatedArtist = await pool.query(
        "UPDATE artists SET artist_name = $2 WHERE artist_id = $1 RETURNING *",
        [artist_id, artist_name]);
    return updatedArtist.rows;
};

module.exports = {
    getAllArtists,
    addArtist,
    deleteArtist,
    updateArtist,
    getArtist,
};