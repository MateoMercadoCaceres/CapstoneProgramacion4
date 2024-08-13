const Player = require('../models/playerModel');

exports.createPlayer = async (name, age, email) => {
    return await Player.create({ name, age, email });
};

exports.getPlayer = async (id) => {
    const player = await Player.findByPk(id);
    if (!player) throw new Error('Player not found');
    return player;
};

exports.updatePlayer = async (id, name, age, email) => {
    const player = await Player.findByPk(id);
    if (!player) throw new Error('Player not found');

    await player.update({ name, age, email });
    const updatedPlayer = await Player.findByPk(id); 
    return updatedPlayer;
};


exports.deletePlayer = async (id) => {
    const player = await Player.findByPk(id);
    if (!player) throw new Error('Player not found');
    
    await player.destroy();
};