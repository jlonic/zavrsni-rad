const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.existingUser(username, email);
        if (existingUser==null || existingUser.length > 0) {
            return res.status(400).json({ message: "User with this username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser(username, email, hashedPassword);
        res.json(newUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding user to database"});
    } 
};

const deleteUser = async (req, res) => { //rastaviti na delete your account i delete user by admin
    try {
        const { user_id } = req.body;
        const user_role = req.user.user_role; 

        if (user_role !== 'admin' || req.user.user_id !== user_id) {
            return res.status(403).json({ message: "Permission denied. You can only delete your own account."});
        }

        const deletedUser = await User.deleteUser(user_id);
        res.json(deletedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error deleting user from database"});
    }
};

const uploadProfilePicture = async (req, res) => {
    try {
        const { user_id, profile_picture } = req.body;
        const updatedUser = await User.uploadProfilePicture(user_id, profile_picture);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating user profile picture"});
    }
};

const removeProfilePicture = async (req, res) => {
    try {
        const { user_id } = req.body;
        const updatedUser = await User.removeProfilePicture(user_id);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error removing user profile picture"});
    }
};

const updateEmail = async (req, res) => {
    try {
        const { user_id, email } = req.body;
        const updatedUser = await User.updateEmail(user_id, email);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating user email"});
    }
};

const updatePassword = async (req, res) => { //test on frontend because of authorization -> localhost:3000/change-password
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1]; 
        const user = jwt.verify(token, '${process.env.JWT_SECRET}');
        
        const user_id = user.user_id;

        const { password } = req.body;

        if (password.length < 3) { //change to 8(?) after testing
            return res.status(400).json({ message: "Password must be at least 3 characters long" });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.updatePassword(user_id, hashedPassword);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error updating user password"});
    }
};


module.exports = {
    createUser,
    deleteUser,
    uploadProfilePicture,
    removeProfilePicture,
    updateEmail,
    updatePassword,
}; 