const Card = require('../models/cardModel');

exports.createCard = async (color, value, gameId) => {
    return await Card.create({ color, value, gameId });
};

exports.getCard = async (id) => {
    const card = await Card.findByPk(id);
    if (!card) throw new Error('Card not found');
    return card;
};

exports.updateCard = async (id, color, value, gameId) => {
    const card = await Card.findByPk(id);
    if (!card) throw new Error('Card not found');

    await card.update({ color, value, gameId });
    const updatedCard = await Card.findByPk(id); 
    return updatedCard;
};

exports.deleteCard = async (id) => {
    const card = await Card.findByPk(id);
    if (!card) throw new Error('Card not found');
    
    await card.destroy();
};
