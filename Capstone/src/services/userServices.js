const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const BlacklistedToken = require('../models/blacklistModel');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });
};

exports.login = async (username, password) => {
    const user = await User.findOne({ where: { username } });
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error("Invalid credentials");
    }
    
    return generateToken(user);
};

exports.createUser = async (username, email, password) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }
    
    return await User.create({ username, email, password });
};

exports.logout = async (token) => {
    const decodedToken = jwt.decode(token);
    const expiresAt = new Date(decodedToken.exp * 1000);

    return await BlacklistedToken.create({ token, expiresAt });
};

exports.getUserProfile = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    
    return { username: user.username, email: user.email };
};

exports.updateUser = async (id, username, email, password) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    await user.update({ username, email, password });
    const updatedUser = await User.findByPk(id);
    return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt
    };
};

