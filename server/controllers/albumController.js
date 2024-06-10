const Album = require("../models/album");
const jwt = require('jsonwebtoken');

const addAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_title, artist_id, release_date } = req.body;
        const newAlbum = await Album.addAlbum(album_title, artist_id, release_date);
        res.json(newAlbum);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding album to database" });
    }
};

const getAlbumsByArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const albums = await Album.getAlbumsByArtist(artist_id);

        if (albums.length === 0) {
            return res.status(404).json({ message: "Albums not found" });
        }

        res.json(albums);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting albums from database" });
    }
};

const updateAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_id } = req.params;
        const { album_title, artist_id, release_date } = req.body;
        const updatedAlbum = await Album.updateAlbum(album_id, album_title, artist_id, release_date);

        if (updatedAlbum.length === 0) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.json(updatedAlbum);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating album in database" });
    }
};

const deleteAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_id } = req.params;
        const deletedAlbum = await Album.deleteAlbum(album_id);

        if (deletedAlbum.length === 0) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.json(deletedAlbum);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting album from database" });
    }
};

const getAlbumByAlbumId = async (req, res) => {
    try {
        const { album_id } = req.params;
        const album = await Album.getAlbumByAlbumId(album_id);

        if (album.length === 0) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.json(album);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting album from database" });
    }
};

module.exports = {
    addAlbum,
    getAlbumsByArtist,
    updateAlbum,
    deleteAlbum,
    getAlbumByAlbumId,
};