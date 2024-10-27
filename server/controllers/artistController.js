const Artist = require("../models/artist");
const Notification = require("../models/notification");
const jwt = require('jsonwebtoken');

const getAllArtists = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const allArtists = await Artist.getAllArtists();
        res.json(allArtists);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error retrieving artists from database" });
    }
};

const addArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }



        const { artist_name, artist_image, artist_info } = req.body;
        const newArtist = await Artist.addArtist(artist_name, artist_image, artist_info);
        res.json(newArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding artist to database" });
    }
};

const deleteArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_id } = req.params;
        const deletedArtist = await Artist.deleteAllArtistData(artist_id);
        res.json(deletedArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting artist from database" });
    }
};

const getArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const artist = await Artist.getArtist(artist_id);

        if (artist.length === 0) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.json(artist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error retrieving artist from database" });
    }
};

const updateArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_id } = req.params;
        const { artist_name, artist_image, artist_info } = req.body;
        const updatedArtist = await Artist.updateArtist(artist_id, artist_name, artist_image, artist_info);

        if (updatedArtist.length === 0) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.json(updatedArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating artist in database" });
    }
};

const getArtistRating = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const artistRating = await Artist.getArtistRating(artist_id);
        res.json(artistRating);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error retrieving artist rating from database" });
    }
};

const softDeleteArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_id } = req.params;
        const deletedArtist = await Artist.softDeleteArtist(artist_id);
        res.json(deletedArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting artist from database" });
    }
};

const restoreArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_id } = req.params;
        const restoredArtist = await Artist.restoreArtist(artist_id);
        res.json(restoredArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error restoring artist in database" });
    }
};

const getSoftDeletedArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_id } = req.params;
        const softDeletedArtist = await Artist.getSoftDeletedArtist(artist_id);
        res.json(softDeletedArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error retrieving soft deleted artist from database" });
    }
};

const getAllSoftDeletedArtists = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const allSoftDeletedArtists = await Artist.getAllSoftDeletedArtists();
        res.json(allSoftDeletedArtists);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error retrieving soft deleted artists from database" });
    }
};

const deleteAllArtistData = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_id } = req.params;
        const deletedArtist = await Artist.deleteAllArtistData(artist_id);
        res.json(deletedArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting artist from database" });
    }
};

const getArtistByName = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        const { artist_name } = req.params;
        const artist = await Artist.getArtistByName(artist_name);

        if (artist.length === 0) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.json(artist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error retrieving artist from database" });
    }
};


module.exports = {
    getAllArtists,
    addArtist,
    deleteArtist,
    updateArtist,
    getArtist,
    getArtistRating,
    softDeleteArtist,
    restoreArtist,
    getAllSoftDeletedArtists,
    getSoftDeletedArtist,
    deleteAllArtistData,
    getArtistByName
}; 