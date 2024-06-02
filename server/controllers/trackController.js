const Track = require("../models/track");

const addTrack = async (req, res) => {
    try {
        const { album_id, track_title, duration, track_number } = req.body;
        const newTrack = await Track.addTrack(album_id, track_title, duration, track_number);
        res.json(newTrack);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding track to database"});
    }
};

const deleteTrack = async (req, res) => {
    try {
        const { track_id } = req.params;
        const deletedTrack = await Track.deleteTrack(track_id);
        res.json(deletedTrack);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting track from database"});
    }
};

//const updateTrack

const getTracksByAlbum = async (req, res) => {
    try {
        const { album_id } = req.params;
        const tracks = await Track.getTracksByAlbum(album_id);
        res.json(tracks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting tracks from database"});
    }
};

const getTracksByArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const tracks = await Track.getTracksByArtist(artist_id);
        res.json(tracks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting tracks from database"});
    }
};


module.exports = {
    addTrack,
    deleteTrack,
    //updateTrack,
    getTracksByAlbum,
    getTracksByArtist,
};