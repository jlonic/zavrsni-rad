const Follow = require("../models/follow");
const jwt = require('jsonwebtoken');

const followUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const follower_id = user.user_id;
        const { followed_id } = req.body;
        const newFollow = await Follow.followUser(follower_id, followed_id);
        res.json(newFollow);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error following user" });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const follower_id = user.user_id;
        const { followed_id } = req.body;
        const deletedFollow = await Follow.unfollowUser(follower_id, followed_id);
        res.json(deletedFollow);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error unfollowing user" });
    }
};

const checkFollowStatus = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const follower_id = user.user_id;
        const { followed_id } = req.params;
        const followStatus = await Follow.checkFollowStatus(follower_id, followed_id);
        res.json(followStatus);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error checking follow status" });
    }
};

const getFollows = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const follower_id = user.user_id;
        const follows = await Follow.getFollows(follower_id);
        res.json(follows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting follows" });
    }
}; 

module.exports = {
    followUser,
    unfollowUser,
    checkFollowStatus,
    getFollows
};