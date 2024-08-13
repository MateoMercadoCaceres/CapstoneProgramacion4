const express = require('express');
const router = express.Router();
const gameControllers = require('../controllers/gameControllers');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/game', verifyToken, gameControllers.createGame);

router.post('/game/join', verifyToken, gameControllers.joinGame);

router.post('/game/start', verifyToken, gameControllers.startGame);

router.post('/game/leave', verifyToken, gameControllers.leaveGame);

router.get('/game/:game_id/players', gameControllers.getPlayers);

router.get('/game/:game_id/current-player', gameControllers.getCurrentPlayer);

router.get('/game/:game_id/top-card', gameControllers.getTopCard);

router.get('/game/:game_id/scores', gameControllers.getScores);

module.exports = router;