const pool = require("../config/db");
const fs = require('fs');
const path = require('path');

const createUser = async (username, email, password) => { //default user role = 'normal'
    const newUser = await pool.query(
        "INSERT INTO users (username, email, password, user_type) VALUES($1, $2, $3, $4) RETURNING *",
        [username, email, password, 'normal']);
    return newUser.rows;
};

const getUserByUsernameOrEmail = async (usernameOrEmail) => { //used for login
    const user = await pool.query(
        "SELECT * FROM users WHERE username = $1 OR email = $1",
        [usernameOrEmail]);
    return user.rows;
};

const existingUser = async (username, email) => { //for duplicate check during registration
    const user = await pool.query(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email]);
    return user.rows;
};

const getHashedPassword = async (usernameOrEmail) => {
    const user = await pool.query(
        "SELECT password FROM users WHERE username = $1 OR email = $1",
        [usernameOrEmail]);
    return user.rows[0].password;
};

const deleteUser = async (user_id) => {
    await pool.query(
        "DELETE FROM reviews WHERE user_id = $1",
        [user_id]);
    await pool.query(
        "DELETE FROM follows WHERE follower_id = $1 OR followed_id = $1",
        [user_id]);
    await pool.query(
        "DELETE FROM notifications WHERE user_id = $1",
        [user_id]);
    await pool.query(
        "DELETE FROM follow_artists WHERE user_id = $1",
        [user_id]);
    await pool.query(
        "DELETE FROM favorites WHERE user_id = $1",
        [user_id]);
    const deletedUser = await pool.query(
        "DELETE FROM users WHERE user_id = $1 RETURNING *",
        [user_id]);
    return deletedUser.rows;
};

const uploadProfilePicture = async (user_id, profile_picture) => {
    const updatedUser = await pool.query(
        "UPDATE users SET profile_picture = $1 WHERE user_id = $2 RETURNING *",
        [profile_picture, user_id]);
    return updatedUser.rows;
};

const removeProfilePicture = async (user_id) => {
    const getUserProfilePicture = await pool.query(
        "SELECT profile_picture FROM users WHERE user_id = $1",
        [user_id]);

    const profile_picture = getUserProfilePicture.rows[0].profile_picture;
    const filePath = path.join(__dirname, '..', profile_picture);

    if (profile_picture !== '/uploads/default.jpg') {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    const updatedUser = await pool.query(
        "UPDATE users SET profile_picture = '/uploads/default.jpg' WHERE user_id = $1 RETURNING *",
        [user_id]);
    return updatedUser.rows;
};

const updateEmail = async (user_id, email) => {
    const updatedUser = await pool.query(
        "UPDATE users SET email = $1 WHERE user_id = $2 RETURNING *",
        [email, user_id]);
    return updatedUser.rows;
};

const updatePassword = async (user_id, password) => {
    const updatedUser = await pool.query(
        "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *",
        [password, user_id]);
    return updatedUser.rows;
};

const getUserByUsername = async (username) => {
    const user = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]);
    return user.rows;
};

const getUsernameByUserId = async (user_id) => {
    const user = await pool.query(
        "SELECT username FROM users WHERE user_id = $1",
        [user_id]);
    return user.rows;
};

const getAllUsers = async () => {
    const users = await pool.query(
        "SELECT * FROM users");
    return users.rows;
};

const updateUser = async (user_id, username, email, user_type) => {
    const updatedUser = await pool.query(
        "UPDATE users SET username = $1, email = $2, user_type = $3 WHERE user_id = $4 RETURNING *",
        [username, email, user_type, user_id]);
    return updatedUser.rows;
};

const getUserById = async (user_id) => {
    const user = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [user_id]);
    return user.rows;
};

module.exports = {
    createUser,
    existingUser,
    deleteUser,
    uploadProfilePicture,
    removeProfilePicture,
    updateEmail,
    updatePassword,
    getUserByUsernameOrEmail,
    getHashedPassword,
    getUserByUsername,
    getUsernameByUserId,
    getAllUsers,
    updateUser,
    getUserById
};