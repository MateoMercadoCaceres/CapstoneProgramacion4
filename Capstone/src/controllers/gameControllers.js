const gameServices = require('../services/gameServices');

exports.createGame = async (req, res) => {
    try {
        const { name, rules, maxPlayers } = req.body;
        const creatorId = req.userId;
        const newGame = await gameServices.createGame(name, rules, creatorId, maxPlayers);
        res.status(201).json({ 
            message: "Game created successfully", 
            game_id: newGame.id 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.joinGame = async (req, res) => {
    try {
        const { game_id } = req.body;
        const userId = req.userId;
        await gameServices.joinGame(game_id, userId);
        res.json({ message: "User joined the game successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.startGame = async (req, res) => {
    try {
        const { game_id } = req.body;
        const userId = req.userId;
        await gameServices.startGame(game_id, userId);
        res.json({ message: "Game started successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.leaveGame = async (req, res) => {
    try {
        const { game_id } = req.body;
        const userId = req.userId;
        await gameServices.leaveGame(game_id, userId);
        res.json({ message: "User left the game successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPlayers = async (req, res) => {
    try {
        const { game_id } = req.params;
        const players = await gameServices.getPlayers(game_id);
        res.json(players);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCurrentPlayer = async (req, res) => {
    try {
        const { game_id } = req.params;
        const currentPlayer = await gameServices.getCurrentPlayer(game_id);
        res.json(currentPlayer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTopCard = async (req, res) => {
    try {
        const { game_id } = req.params;
        const topCard = await gameServices.getTopCard(game_id);
        res.json(topCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getScores = async (req, res) => {
    try {
        const { game_id } = req.params;
        const scores = await gameServices.getScores(game_id);
        res.json(scores);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};