const Track = require("../models/track");
const jwt = require('jsonwebtoken');

const addTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_id, track_title, duration, track_number } = req.body;
        const newTrack = await Track.addTrack(album_id, track_title, duration, track_number);
        res.json(newTrack);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding track to database" });
    }
};

const deleteTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { track_id } = req.params;
        const deletedTrack = await Track.deleteTrack(track_id);
        res.json(deletedTrack);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting track from database" });
    }
};

const updateTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { track_id } = req.params;
        const { album_id, track_title, duration, track_number } = req.body;
        const updatedTrack = await Track.updateTrack(track_id, album_id, track_title, duration, track_number);
        res.json(updatedTrack);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating track in database" });
    }
};

const getTracksByAlbum = async (req, res) => {
    try {
        const { album_id } = req.params;
        const tracks = await Track.getTracksByAlbum(album_id);
        res.json(tracks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting tracks from database" });
    }
};

const getTracksByArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const tracks = await Track.getTracksByArtist(artist_id);
        res.json(tracks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting tracks from database" });
    }
};

const getTrackByTrackId = async (req, res) => {
    try {
        const { track_id } = req.params;
        const track = await Track.getTrackByTrackId(track_id);

        if (track.length === 0) {
            return res.status(404).json({ message: "Track not found" });
        }

        res.json(track);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting track from database" });
    }
};

const getTrackRating = async (req, res) => {
    try {
        const { track_id } = req.params;
        const trackRating = await Track.getTrackRating(track_id);
        res.json(trackRating);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting track rating from database" });
    }
};

const softDeleteTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { track_id } = req.params;
        const deletedTrack = await Track.softDeleteTrack(track_id);
        res.json(deletedTrack);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting track from database" });
    }
};

const restoreTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { track_id } = req.params;
        const restoredTrack = await Track.restoreTrack(track_id);
        res.json(restoredTrack);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error restoring track in database" });
    }
};

const getSoftDeletedTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { track_id } = req.params;
        const track = await Track.getSoftDeletedTrack(track_id);
        res.json(track);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting soft deleted track from database" });
    }
};

const getTrackByTrackTitle = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { track_title } = req.params;
        const track = await Track.getTrackByTrackTitle(track_title);
        res.json(track);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting track from database" });
    }
};

const getTracksByAlbumName = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_name } = req.params;
        const track = await Track.getTracksByAlbumName(album_name);
        res.json(track);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting track from database" });
    }
};

const getTracksByArtistName = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_name } = req.params; 
        const track = await Track.getTracksByArtistName(artist_name);
        res.json(track);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting track from database" });
    }
};



module.exports = {
    addTrack,
    deleteTrack,
    updateTrack,
    getTracksByAlbum,
    getTracksByArtist,
    getTrackByTrackId,
    getTrackRating,
    softDeleteTrack,
    restoreTrack,
    getSoftDeletedTrack,
    getTrackByTrackTitle,
    getTracksByAlbumName,
    getTracksByArtistName
};