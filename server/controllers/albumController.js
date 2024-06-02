const Album = require("../models/album");

const addAlbum = async (req, res) => {
    try {
        const { album_title, artist_id, release_date } = req.body;
        const newAlbum = await Album.addAlbum(album_title, artist_id, release_date);
        res.json(newAlbum);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding album to database"});
    }
};

const getAlbumsByArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const albums = await Album.getAlbumsByArtist(artist_id);
        res.json(albums);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting albums from database"});
    }
};

//const updateAlbum

const deleteAlbum = async (req, res) => {
    try {
        const { album_id } = req.params;
        const deletedAlbum = await Album.deleteAlbum(album_id);
        res.json(deletedAlbum);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting album from database"});
    }
};

module.exports = {
    addAlbum,
    getAlbumsByArtist,
    //updateAlbum,
    deleteAlbum,
};