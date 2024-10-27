const Favorites = require("../models/favorite");
const jwt = require('jsonwebtoken');

const addFavoriteAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { album_id } = req.body;
        const newFavorite = await Favorites.addFavoriteAlbum(user_id, album_id);
        res.json(newFavorite);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding favorite album" });
    }
};

const removeFavoriteAlbum = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { album_id } = req.body;
        const deletedFavorite = await Favorites.removeFavoriteAlbum(user_id, album_id);
        res.json(deletedFavorite);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error removing favorite album" });
    }
};

const addFavoriteTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { track_id } = req.body;
        const newFavorite = await Favorites.addFavoriteTrack(user_id, track_id);
        res.json(newFavorite);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding favorite track" });
    }
};

const removeFavoriteTrack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { track_id } = req.body;
        const deletedFavorite = await Favorites.removeFavoriteTrack(user_id, track_id);
        res.json(deletedFavorite);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error removing favorite track" });
    }
};

const checkFavoriteAlbumStatus = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { album_id } = req.params;
        const favorite = await Favorites.checkFavoriteAlbumStatus(user_id, album_id);
        res.json(favorite);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error checking favorite album status" });
    }
};

const checkFavoriteTrackStatus = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { track_id } = req.params;
        const favorite = await Favorites.checkFavoriteTrackStatus(user_id, track_id);
        res.json(favorite);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error checking favorite track status" });
    }
};

const getUserFavoriteAlbums = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { username } = req.params;
        const favorites = await Favorites.getUserFavoriteAlbums(username);
        res.json(favorites);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching user favorites" });
    }
};

const getUserFavoriteTracks = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { username } = req.params;
        const favorites = await Favorites.getUserFavoriteTracks(username);
        res.json(favorites);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error fetching user favorites" });
    }
};

module.exports = {
    addFavoriteAlbum,
    removeFavoriteAlbum,
    addFavoriteTrack,
    removeFavoriteTrack,
    checkFavoriteAlbumStatus,
    checkFavoriteTrackStatus,
    getUserFavoriteAlbums,
    getUserFavoriteTracks
};