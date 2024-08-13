const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const gameControllers = require('../controllers/gameControllers');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', userControllers.createUser);

router.post('/login', userControllers.login);

router.post('/logout', verifyToken, userControllers.logout);

router.get('/profile', verifyToken, userControllers.getUserProfile);

router.post('/game', verifyToken, gameControllers.createGame);

module.exports = router;