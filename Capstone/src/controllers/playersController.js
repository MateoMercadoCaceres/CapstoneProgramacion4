const playerServices = require('../services/playerServices');

exports.createPlayer = async (req, res) => {
    try {
        const { name, age, email } = req.body;
        const newPlayer = await playerServices.createPlayer(name, age, email);
        res.status(201).json({
            id: newPlayer.id,
            name: newPlayer.name,
            age: newPlayer.age,
            email: newPlayer.email,
            createdAt: newPlayer.createdAt
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPlayer = async (req, res) => {
    try {
        const player = await playerServices.getPlayer(req.params.id);
        res.json({
            id: player.id,
            name: player.name,
            age: player.age,
            email: player.email,
            createdAt: player.createdAt
        });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.updatePlayer = async (req, res) => {
    try {
        const { name, age, email } = req.body;
        const updatedPlayer = await playerServices.updatePlayer(req.params.id, name, age, email);
        res.json({
            id: updatedPlayer.id,
            name: updatedPlayer.name,
            age: updatedPlayer.age,
            email: updatedPlayer.email,
            createdAt: updatedPlayer.createdAt
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePlayer = async (req, res) => {
    try {
        await playerServices.deletePlayer(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};