const cardServices = require('../services/cardServices');

exports.createCard = async (req, res) => {
    try {
        const { color, value, gameId } = req.body;
        const newCard = await cardServices.createCard(color, value, gameId);
        res.status(201).json({
            id: newCard.id,
            color: newCard.color,
            value: newCard.value,
            gameId: newCard.gameId,
            createdAt: newCard.createdAt
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCard = async (req, res) => {
    try {
        const card = await cardServices.getCard(req.params.id);
        res.json({
            id: card.id,
            color: card.color,
            value: card.value,
            gameId: card.gameId,
            createdAt: card.createdAt
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.updateCard = async (req, res) => {
    try {
        const { color, value, gameId } = req.body;
        const updatedCard = await cardServices.updateCard(req.params.id, color, value, gameId);
        res.json({
            id: updatedCard.id,
            color: updatedCard.color,
            value: updatedCard.value,
            gameId: updatedCard.gameId,
            createdAt: updatedCard.createdAt
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        await cardServices.deleteCard(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};