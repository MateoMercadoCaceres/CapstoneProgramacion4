const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/blacklistModel');

exports.verifyToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(403).json({ error: "No token provided" });
        }

        const blacklistedToken = await BlacklistedToken.findOne({ where: { token } });
        if (blacklistedToken) {
            return res.status(401).json({ error: "Token is blacklisted" });
        }

        const decoded = jwt.verify(token, 'your_secret_key');
        req.userId = decoded.id;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};