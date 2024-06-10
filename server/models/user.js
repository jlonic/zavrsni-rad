const pool = require("../config/db");

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
    const updatedUser = await pool.query(
        "UPDATE users SET profile_picture = NULL WHERE user_id = $1 RETURNING *",
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
    getUsernameByUserId
};