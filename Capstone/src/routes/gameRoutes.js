const express = require('express');
const router = express.Router();
const gameControllers = require('../controllers/gameControllers');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/game', verifyToken, gameControllers.createGame);

router.post('/game/join', verifyToken, gameControllers.joinGame);

router.post('/game/start', verifyToken, gameControllers.startGame);

router.post('/game/leave', verifyToken, gameControllers.leaveGame);

router.post('/game/:game_id/deal', verifyToken, gameControllers.dealCards);

router.post('/game/:game_id/play/:cardPlayed', verifyToken, gameControllers.playCard);

router.post('/game/:game_id/draw', verifyToken, gameControllers.drawCard);

router.post('/game/:game_id/say-uno', verifyToken, gameControllers.sayUno);

router.post('/game/:game_id/challenge-uno/:challenged_player_id', verifyToken, gameControllers.challengeUno);

router.get('/game/:gameId/state', verifyToken, gameControllers.getGameState);

router.get('/game/:game_id/players', verifyToken, gameControllers.getPlayers);

router.get('/game/:game_id/current-player', verifyToken, gameControllers.getCurrentPlayer);

router.get('/game/:game_id/top-card', verifyToken, gameControllers.getTopCard);

router.get('/game/:game_id/hand/', verifyToken, gameControllers.getPlayerHand);

router.get('/game/:game_id/scores', verifyToken, gameControllers.getScores);

module.exports = router;