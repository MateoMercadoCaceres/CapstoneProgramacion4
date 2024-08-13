const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/players' , verifyToken, playersController.createPlayer);

router.get('/players/:id' , verifyToken, playersController.getPlayer);

router.put('/players/:id' , verifyToken, playersController.updatePlayer);

router.delete('/players/:id' , verifyToken, playersController.deletePlayer);

module.exports = router;