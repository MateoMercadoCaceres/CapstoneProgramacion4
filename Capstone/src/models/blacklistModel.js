const { sequelize, DataTypes } = require('../middlewares/middleware');

const BlacklistedToken = sequelize.define('BlacklistedToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = BlacklistedToken;