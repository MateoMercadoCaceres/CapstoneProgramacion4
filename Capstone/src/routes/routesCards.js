const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cardsController')

const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/cards' , verifyToken, cardsController.createCard);

router.get('/cards/:id' , verifyToken, cardsController.getCard);

router.put('/cards/:id' , verifyToken, cardsController.updateCard);

router.delete('/cards/:id' , verifyToken, cardsController.deleteCard);

module.exports = router;