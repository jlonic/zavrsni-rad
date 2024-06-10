const pool = require("../config/db");

const addTrack = async (album_id, track_title, duration, track_number) => {
    const newTrack = await pool.query(
        "INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES($1, $2, $3, $4) RETURNING *",
        [album_id, track_title, duration, track_number]);
    return newTrack.rows;
};

const deleteTrack = async (track_id) => {
    const deletedTrack = await pool.query(
        "DELETE FROM tracks WHERE track_id = $1 RETURNING *",
        [track_id]);
    return deletedTrack.rows;
};

const updateTrack = async (track_id, album_id, track_title, duration, track_number) => {
    const updatedTrack = await pool.query(
        "UPDATE tracks SET album_id = $1, track_title = $2, duration = $3, track_number = $4 WHERE track_id = $5 RETURNING *",
        [album_id, track_title, duration, track_number, track_id]);
    return updatedTrack.rows;
};

const getTracksByAlbum = async (album_id) => {
    const tracks = await pool.query(
        "SELECT * FROM tracks WHERE album_id = $1",
        [album_id]);
    return tracks.rows;
};

const getTracksByArtist = async (artist_id) => {
    const tracks = await pool.query(
        "SELECT tr.* FROM tracks tr INNER JOIN albums alb ON tr.album_id = alb.album_id INNER JOIN artists art ON alb.artist_id = art.artist_id WHERE art.artist_id = $1",
        [artist_id]);
    return tracks.rows;
};

const getTrackByTrackId = async (track_id) => {
    const track = await pool.query(
        "SELECT * FROM tracks WHERE track_id = $1",
        [track_id]);
    return track.rows;
};

module.exports = {
    addTrack,
    deleteTrack,
    updateTrack,
    getTracksByAlbum,
    getTracksByArtist,
    getTrackByTrackId
};