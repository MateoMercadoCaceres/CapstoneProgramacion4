const { sequelize, DataTypes } = require('../middlewares/middleware');
const User = require('./userModel');

const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rules: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM('waiting', 'in_progress', 'ended'),
        defaultValue: 'waiting'
    },
    currentPlayerId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    topCard: {
        type: DataTypes.STRING,
        allowNull: true
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    maxPlayers: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

const GamePlayers = sequelize.define('GamePlayers', {
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

Game.belongsToMany(User, { through: GamePlayers });
User.belongsToMany(Game, { through: GamePlayers });
Game.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

module.exports = Game;