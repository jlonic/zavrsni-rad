const Album = require("../models/album");
const Notification = require("../models/notification");
const FollowArtist = require("../models/followArtist");
const Artist = require("../models/artist");
const jwt = require('jsonwebtoken');

const addAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_title, artist_id, release_date, cover_image, record_type, album_info } = req.body;
        
        const artist = await Artist.getArtist(artist_id);
        const artistFollowers = await FollowArtist.getAllArtistFollowers(artist_id);

        for (let i = 0; i < artistFollowers.length; i++) {
            await Notification.createNotification(artistFollowers[i].user_id, `New album by ${artist[0].artist_name}: ${album_title}`); 
        }

        const newAlbum = await Album.addAlbum(album_title, artist_id, release_date, cover_image, record_type, album_info);
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

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_id } = req.params;
        const { album_title, artist_id, release_date, cover_image, record_type, album_info } = req.body;
        const updatedAlbum = await Album.updateAlbum(album_id, album_title, artist_id, release_date, cover_image, record_type, album_info);

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

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_id } = req.params;
        const deletedAlbum = await Album.deleteAllAlbumData(album_id);

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

const getAlbumRating = async (req, res) => {
    try {
        const { album_id } = req.params;
        const albumRating = await Album.getAlbumRating(album_id);
        res.json(albumRating);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting album rating from database" });
    }
};

const softDeleteAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_id } = req.params;
        const softDeletedAlbum = await Album.softDeleteAlbum(album_id);
        res.json(softDeletedAlbum);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error soft deleting album from database" });
    }
};

const restoreAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_id } = req.params;
        const restoredAlbum = await Album.restoreAlbum(album_id);
        res.json(restoredAlbum);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error restoring album in database" });
    }
};

// const getSoftDeletedAlbum = async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         const token = authHeader.split(' ')[1];
//         const user = jwt.verify(token, '${process.env.JWT_SECRET}');

//         if (user.user_role !== "administrator") {
//             return res.status(403).json({ message: "Unauthorized" });
//         }

//         const { album_id } = req.params;
//         const softDeletedAlbum = await Album.getSoftDeletedAlbum(album_id);
//         res.json(softDeletedAlbum);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: "Error getting soft deleted album from database" });
//     }
// };

const deleteAllAlbumData = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { album_id } = req.params;
        const deletedAlbum = await Album.deleteAllAlbumData(album_id);
        res.json(deletedAlbum);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting album from database" });
    }
};

const getAllAlbums = async (req, res) => {
    try { 
        const { limit, offset } = req.params;
        const albums = await Album.getAllAlbums(limit, offset);
        res.json(albums);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting albums from database" });
    }
};

const getAlbumByTitle = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        } 

        const { album_title } = req.params;
        const album = await Album.getAlbumByTitle(album_title);

        if (album.length === 0) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.json(album);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting album from database" });
    }
};

const getAlbumsByArtistName = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== "administrator") {
            return res.status(403).json({ message: "Unauthorized" });
        } 

        const { artist_name } = req.params;
        const albums = await Album.getAlbumsByArtistName(artist_name);
        if (albums.length === 0) {
            return res.status(404).json({ message: "Albums not found" });
        }
        res.json(albums);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting albums from database" });
    }
};


module.exports = {
    addAlbum,
    getAlbumsByArtist,
    updateAlbum,
    deleteAlbum,
    getAlbumByAlbumId,
    getAlbumRating,
    softDeleteAlbum,
    restoreAlbum,
    // getSoftDeletedAlbum,
    deleteAllAlbumData,
    getAllAlbums,
    getAlbumByTitle,
    getAlbumsByArtistName
};