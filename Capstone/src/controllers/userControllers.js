const userServices = require('../services/userServices');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await userServices.login(username, password);
        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await userServices.createUser(username, email, password);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const { token } = req.body;
        await userServices.logout(token);
        res.json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userProfile = await userServices.getUserProfile(req.userId);
        res.json(userProfile);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updatedUser = await userServices.updateUser(req.params.id, username, email, password);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};