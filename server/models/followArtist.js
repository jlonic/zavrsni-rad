const pool = require("../config/db");

const followArtist = async (user_id, artist_id) => {
    const newFollow = await pool.query(
        "INSERT INTO follow_artists (user_id, artist_id) VALUES($1, $2) RETURNING *",
        [user_id, artist_id]);
    return newFollow.rows;
};

const unfollowArtist = async (user_id, artist_id) => {
    const deletedFollow = await pool.query(
        "DELETE FROM follow_artists WHERE user_id = $1 AND artist_id = $2 RETURNING *",
        [user_id, artist_id]);
    return deletedFollow.rows;
};

const checkArtistFollowStatus = async (user_id, artist_id) => {
    const followStatus = await pool.query(
        "SELECT * FROM follow_artists WHERE user_id = $1 AND artist_id = $2",
        [user_id, artist_id]);
    return followStatus.rows;
};

const getAllArtistFollowers = async (artist_id) => {
    const followers = await pool.query(
        "SELECT * FROM follow_artists WHERE artist_id = $1",
        [artist_id]);
    return followers.rows;
};

const getNumberOfFollowers = async (artist_id) => {
    const followers = await pool.query(
        "SELECT COUNT(user_id) FROM follow_artists WHERE artist_id = $1",
        [artist_id]);
    return followers.rows;
};

module.exports = {
    followArtist,
    unfollowArtist,
    checkArtistFollowStatus,
    getAllArtistFollowers,
    getNumberOfFollowers
};