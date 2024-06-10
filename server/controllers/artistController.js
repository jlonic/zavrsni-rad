const Artist = require("../models/artist");
const jwt = require('jsonwebtoken');

const getAllArtists = async (_, res) => {
    try {
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

        if (user.role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }
        //add more artist info after db update
        const { artist_name, artist_image } = req.body;
        const newArtist = await Artist.addArtist(artist_name, artist_image);
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

        if (user.role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_id } = req.params;
        const deletedArtist = await Artist.deleteArtist(artist_id);
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

        if (user.role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { artist_id } = req.params;
        const { artist_name } = req.body;
        const updatedArtist = await Artist.updateArtist(artist_id, artist_name);

        if (updatedArtist.length === 0) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.json(updatedArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating artist in database" });
    }
};


module.exports = {
    getAllArtists,
    addArtist,
    deleteArtist,
    updateArtist,
    getArtist,
}; 