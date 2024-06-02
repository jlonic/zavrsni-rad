const Artist = require("../models/artist");

const getAllArtists = async (_, res) => {
    try {
        const allArtists = await Artist.getAllArtists();
        res.json(allArtists);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error retrieving artists from database"});
    }
};

const addArtist = async (req, res) => {
    try {
        const { artist_name } = req.body;
        const newArtist = await Artist.addArtist(artist_name);
        res.json(newArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding artist to database"});
    }
};

const deleteArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const deletedArtist = await Artist.deleteArtist(artist_id);
        res.json(deletedArtist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting artist from database"});
    }
}

// const updateArtist


module.exports = {
    getAllArtists,
    addArtist,
    deleteArtist,
    // updateArtist
}; 