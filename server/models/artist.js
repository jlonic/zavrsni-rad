const pool = require("../config/db");

const getAllArtists = async () => {
    const allArtists = await pool.query(
        "SELECT * FROM artists");
    return allArtists.rows;
};

const addArtist = async (artist_name) => {
    const newArtist = await pool.query(
        "INSERT INTO artists (artist_name) VALUES($1) RETURNING *", 
        [artist_name]);
    return newArtist.rows;
};

const deleteArtist = async (artist_id) => {
    const deletedArtist = await pool.query(
        "DELETE FROM artists WHERE artist_id = $1", 
        [artist_id]);
    return deletedArtist.rows;
};

// const updateArtist 

module.exports = {
    getAllArtists,
    addArtist,
    deleteArtist,
    // updateArtist
};