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
        const gameState = await gameServices.startGame(game_id, userId);
        res.json({ 
            message: "Game started successfully",
            hands: gameState.hands,
            topCard: gameState.topCard,
            firstPlayer: gameState.firstPlayer
        });
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
        
        if (!game_id) {
            return res.status(400).json({ error: "Game ID is required" });
        }

        console.log(`Fetching players for game ID: ${game_id}`);
        
        const players = await gameServices.getPlayers(game_id);
        
        if (!players || players.length === 0) {
            return res.status(404).json({ error: "No players found for this game" });
        }
        
        res.json(players);
    } catch (error) {
        console.error(`Error in getPlayers controller: ${error.message}`);
        if (error.message === "Game not found") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
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

exports.dealCards = async (req, res) => {
    try {
        const { game_id, cardsPerPlayer } = req.body;
        const hands = await gameServices.dealCards(game_id, cardsPerPlayer);
        res.status(200).json({
            message: "Cards dealt successfully.",
            players: hands
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.playCard = async (req, res) => {
    try {
        const { game_id, cardPlayed } = req.params;
        const player = req.userId;
        const result = await gameServices.playCard(game_id, player, cardPlayed);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error in playCard: ${error.message}`);
        if (error.message === "Game not found") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

exports.drawCard = async (req, res) => {
    try {
        const { game_id } = req.params;
        const player = req.userId;
        const result = await gameServices.drawCard(game_id, player);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.sayUno = async (req, res) => {
    try {
        const { game_id } = req.body;
        const userId = req.userId;
        const result = await gameServices.sayUno(game_id, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.challengeUno = async (req, res) => {
    try {
        const { game_id, challenged_player_id } = req.body;
        const challengerId = req.userId;
        const result = await gameServices.challengeUno(game_id, challengerId, challenged_player_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGameState = async (req, res) => {
    try {
        const { game_id } = req.params;
        const gameState = await gameServices.getGameState(game_id);
        res.status(200).json(gameState);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPlayerHand = async (req, res) => {
    try {
        const { game_id } = req.params;
        const playerID = req.userId;
        const hand = await gameServices.getPlayerHand(game_id, playerID);
        res.status(200).json({ playerID, hand });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getScores = async (req, res) => {
    try {
        const { game_id } = req.params;
        const scores = await gameServices.getScores(game_id);
        res.status(200).json({ scores });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};