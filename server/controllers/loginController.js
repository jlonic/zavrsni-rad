const User = require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        const user = await User.getUserByUsernameOrEmail(usernameOrEmail);
        const hashedPassword = user[0].password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user[0].user_id, username: user[0].username, profile_picture: user[0].profile_picture, email: user[0].email, user_role: user[0].user_type },
            '${process.env.JWT_SECRET}',
            { expiresIn: '12h' }
        );
        //console.log(token);
        res.json({ token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

const logout = (_, res) => {
    localStorage.removeItem('token');
    res.json({ message: 'Logged out' });
};



module.exports = {
    login,
    logout
};