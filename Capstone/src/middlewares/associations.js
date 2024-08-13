const Game = require('./models/gameModel');
const User = require('./models/userModel');
const GamePlayers = require('./models/gamePlayersModel');

const setupAssociations = () => {
  Game.belongsToMany(User, { through: GamePlayers });
  User.belongsToMany(Game, { through: GamePlayers });
  Game.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
};

module.exports = setupAssociations;