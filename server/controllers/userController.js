const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.existingUser(username, email);
        if (existingUser == null || existingUser.length > 0) {
            return res.status(400).json({ message: "User with this username or email already exists" });
        }

        if (password.length < 8) { 
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser(username, email, hashedPassword);
        res.json(newUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding user to database" });
    }
};

const deleteYourAccount = async (req, res) => { //for deleting own account
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const deletedUser = await User.deleteUser(user_id);
        res.json(deletedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting user from database" });
    }
};


const deleteUser = async (req, res) => { //for admin to delete users
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== 'administrator') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { user_id } = req.params;
        const deletedUser = await User.deleteUser(user_id);
        res.json(deletedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting user from database" });
    }
};

const uploadProfilePicture = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { profile_picture } = req.body;
        const updatedUser = await User.uploadProfilePicture(user_id, profile_picture);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating user profile picture" });
    }
};

const removeProfilePicture = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== 'administrator' && user.user_id !== req.params.user_id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { user_id } = req.params;
        const updatedUser = await User.removeProfilePicture(user_id);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error removing user profile picture" });
    }
};

const updateEmail = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { email } = req.body;

        const existingUser = await User.existingUser(null, email); //null is userId so that it searches by email only
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const updatedUser = await User.updateEmail(user_id, email);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating user email" });
    }
};

const updatePassword = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        const user_id = user.user_id;
        const { password } = req.body;

        if (password.length < 8) { 
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.updatePassword(user_id, hashedPassword);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating user password" });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.getUserByUsername(username);
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting user from database" });
    }
};

const getUsernameByUserId = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { user_id } = req.params;
        const user = await User.getUsernameByUserId(user_id);
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting user from database" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== 'administrator') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting users from database" });
    }
};

const updateUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== 'administrator') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { user_id } = req.params;
        const { username, email, user_type } = req.body;
        const updatedUser = await User.updateUser(user_id, username, email, user_type);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating user" });
    }
};

const getUserById = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        jwt.verify(token, '${process.env.JWT_SECRET}');

        const { user_id } = req.params;
        const getUser = await User.getUserById(user_id);
        res.json(getUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error getting user from database" });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== 'administrator') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { user_id } = req.params;
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.updatePassword(user_id, hashedPassword);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating user password" });
    }
};

const removeUserProfilePicture = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');

        if (user.user_role !== 'administrator') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { user_id } = req.params;
        const updatedUser = await User.removeProfilePicture(user_id);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error removing user profile picture" });
    }
};

module.exports = {
    createUser,
    deleteYourAccount,
    deleteUser,
    uploadProfilePicture,
    removeProfilePicture,
    updateEmail,
    updatePassword,
    getUserByUsername,
    getUsernameByUserId,
    getAllUsers,
    updateUser,
    getUserById,
    updateUserPassword,
    removeUserProfilePicture
}; 