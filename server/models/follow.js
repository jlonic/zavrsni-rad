const pool = require("../config/db");

const followUser = async (follower_id, followed_id) => {
    const newFollow = await pool.query(
        "INSERT INTO follows (follower_id, followed_id) VALUES($1, $2) RETURNING *",
        [follower_id, followed_id]);
    return newFollow.rows;
};

const unfollowUser = async (follower_id, followed_id) => {
    const deletedFollow = await pool.query(
        "DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2 RETURNING *",
        [follower_id, followed_id]);
    return deletedFollow.rows;
};

const checkFollowStatus = async (follower_id, followed_id) => {
    const followStatus = await pool.query(
        "SELECT * FROM follows WHERE follower_id = $1 AND followed_id = $2",
        [follower_id, followed_id]);
    return followStatus.rows;
};

const getFollows = async (follower_id) => {
    const followStatus = await pool.query(
        "SELECT f.*, u.username FROM follows f INNER JOIN users u ON f.followed_id = u.user_id WHERE follower_id = $1",
        [follower_id]);
    return followStatus.rows;
};


module.exports = {
    followUser,
    unfollowUser,
    checkFollowStatus,
    getFollows,
};