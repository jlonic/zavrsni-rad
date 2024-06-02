const Follow = require("../models/follow");

const followUser = async (req, res) => {
    try {
        const { follower_id, followed_id } = req.body;
        const newFollow = await Follow.followUser(follower_id, followed_id);
        res.json(newFollow);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error following user"});
    }
};

const unfollowUser = async (req, res) => {
    try {
        const { follower_id, followed_id } = req.body;
        const deletedFollow = await Follow.unfollowUser(follower_id, followed_id);
        res.json(deletedFollow);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error unfollowing user"});
    }
};


module.exports = {
    followUser,
    unfollowUser,
};