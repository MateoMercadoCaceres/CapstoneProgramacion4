const Game = require('../models/gameModel');
const User = require('../models/userModel');

exports.createGame = async (name, rules, creatorId, maxPlayers) => {
    return await Game.create({ name, rules, creatorId, maxPlayers });
};

exports.joinGame = async (gameId, userId) => {
    const game = await Game.findByPk(gameId, {
        include: [{ model: User }]
    });
    if (!game) {
        throw new Error("Game not found");
    }
    if (game.maxPlayers && game.Users && game.Users.length >= game.maxPlayers) {
        throw new Error("Game is full");
    }
    const user = await User.findByPk(userId);
    await game.addUser(user);
};

exports.startGame = async (gameId, userId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }
    if (game.creatorId !== userId) {
        throw new Error("Only the game creator can start the game");
    }
    if (game.state !== 'waiting') {
        throw new Error("Game is not in waiting state");
    }
    game.state = 'in_progress';
    await game.save();
};

exports.leaveGame = async (gameId, userId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }
    const user = await User.findByPk(userId);
    await game.removeUser(user);
};

exports.getPlayers = async (gameId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }
    return {
        game_id: game.id,
        players: game.Users.map(user => user.username)
    };
};

exports.getCurrentPlayer = async (gameId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }
    const currentPlayer = game.Users.find(user => user.id === game.currentPlayerId);
    return {
        game_id: game.id,
        current_player: currentPlayer ? currentPlayer.username : null
    };
};

exports.getTopCard = async (gameId) => {
    const game = await Game.findByPk(gameId);
    if (!game) {
        throw new Error("Game not found");
    }
    return {
        game_id: game.id,
        top_card: game.topCard
    };
};

exports.getScores = async (gameId) => {
    const game = await Game.findByPk(gameId, { 
        include: {
            model: User,
            attributes: ['username'],
            through: { attributes: ['score'] }
        }
    });
    if (!game) {
        throw new Error("Game not found");
    }
    const scores = {};
    game.Users.forEach(user => {
        scores[user.username] = user.GamePlayers.score;
    });
    return {
        game_id: game.id,
        scores: scores
    };
};