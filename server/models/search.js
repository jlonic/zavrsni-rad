const pool = require("../config/db");

const search = async (keyword, category) => {
    const searchQuery = `%${keyword}%`;

    let artists = { rows: [] }, albums = { rows: [] }, tracks = { rows: [] }, users = { rows: [] };

    if (category === 'all' || category === 'artists') {
        artists = await pool.query(
            "SELECT artist_id, artist_name, artist_image FROM artists WHERE artist_name ILIKE $1 AND is_deleted != TRUE",
            [searchQuery]);
    }

    if (category === 'all' || category === 'albums') {
        albums = await pool.query(
            "SELECT album_id, album_title, release_date, cover_image FROM albums WHERE album_title ILIKE $1 AND is_deleted != TRUE",
            [searchQuery]);
    }

    if (category === 'all' || category === 'tracks') {
        tracks = await pool.query(
            "SELECT tr.track_id, tr.track_title, tr.duration, a.cover_image FROM tracks tr INNER JOIN albums a ON tr.album_id = a.album_id WHERE tr.track_title ILIKE $1 AND tr.is_deleted != TRUE",
            [searchQuery]);
    }

    if (category === 'all' || category === 'users') {
        users = await pool.query(
            "SELECT user_id, username, profile_picture FROM users WHERE username ILIKE $1 AND is_deleted != TRUE",
            [searchQuery]);
    }

    const results = [
        ...artists.rows,
        ...albums.rows,
        ...tracks.rows,
        ...users.rows
    ];

    return results;
};

module.exports = {
    search
};