const FollowArtists = require("../models/followArtist");
const jwt = require('jsonwebtoken');

const followArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { artist_id } = req.body;
        const newFollow = await FollowArtists.followArtist(user_id, artist_id);
        res.json(newFollow);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error following artist" });
    }
};

const unfollowArtist = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { artist_id } = req.body;
        const deletedFollow = await FollowArtists.unfollowArtist(user_id, artist_id);
        res.json(deletedFollow);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error unfollowing artist" });
    }
};

const checkArtistFollowStatus = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { artist_id } = req.params;
        const followStatus = await FollowArtists.checkArtistFollowStatus(user_id, artist_id);
        res.json(followStatus);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error checking follow status" });
    }
};

const getAllArtistFollowers = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const followers = await FollowArtists.getAllArtistFollowers(artist_id);
        res.json(followers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting followers" });
    }
};

const getNumberOfFollowers = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const followers = await FollowArtists.getNumberOfFollowers(artist_id);
        res.json(followers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting number of followers" });
    }
};


module.exports = {
    followArtist,
    unfollowArtist,
    checkArtistFollowStatus,
    getAllArtistFollowers,
    getNumberOfFollowers
};