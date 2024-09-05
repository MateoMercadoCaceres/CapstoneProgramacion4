const Game = require('../models/gameModel');
const User = require('../models/userModel');
const Card = require('../models/cardModel');

exports.createGame = async (name, rules, creatorId, maxPlayers) => {
    return await Game.create({ name, rules, creatorId, maxPlayers });
};

exports.joinGame = async (gameId, userId) => {
    const game = await Game.findByPk(gameId, {
        include: [{ model: User }]
    });
    if (!game) {
        throw new Error("Game not found");
    }
    if (game.maxPlayers && game.Users && game.Users.length >= game.maxPlayers) {
        throw new Error("Game is full");
    }
    const user = await User.findByPk(userId);
    await game.addUser(user);
};

exports.startGame = async (gameId, userId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }
    if (game.creatorId !== userId) {
        throw new Error("Only the game creator can start the game");
    }
    if (game.state !== 'waiting') {
        throw new Error("Game is not in waiting state");
    }
    
    const deck = await createDeck(gameId);
    shuffle(deck);
    
    const hands = await dealCards(game, deck);
    
    const topCard = await selectInitialTopCard(gameId);
    game.topCard = `${topCard.color} ${topCard.value}`;
    
    const players = game.Users;
    const firstPlayerIndex = Math.floor(Math.random() * players.length);
    game.currentPlayerId = players[firstPlayerIndex].id;
    
    game.state = 'in_progress';
    await game.save();
    
    return { hands, topCard: game.topCard, firstPlayer: players[firstPlayerIndex].username };
};

exports.leaveGame = async (gameId, userId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }
    const user = await User.findByPk(userId);
    await game.removeUser(user);
};

exports.getPlayers = async (game_id) => {
    console.log(`Fetching game with ID: ${game_id}`);
    
    const game = await Game.findByPk(game_id, {
        include: [{
            model: User,
            attributes: ['id', 'username'],
            through: { attributes: [] } 
        }]
    });

    if (!game) {
        console.log(`Game with ID ${game_id} not found`);
        throw new Error("Game not found");
    }

    console.log(`Found game: ${game.id}, Players: ${game.Users.length}`);

    return {
        game_id: game.id,
        players: game.Users.map(user => user.username)
    };
};

exports.getCurrentPlayer = async (gameId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }
    const currentPlayer = game.Users.find(user => user.id === game.currentPlayerId);
    return {
        game_id: game.id,
        current_player: currentPlayer ? currentPlayer.username : null
    };
};

exports.getTopCard = async (gameId) => {
    const game = await Game.findByPk(gameId);
    if (!game) {
        throw new Error("Game not found");
    }
    return {
        game_id: game.id,
        top_card: game.topCard
    };
};

exports.getScores = async (gameId) => {
    const game = await Game.findByPk(gameId, { 
        include: {
            model: User,
            attributes: ['username'],
            through: { attributes: ['score'] }
        }
    });
    if (!game) {
        throw new Error("Game not found");
    }
    const scores = {};
    game.Users.forEach(user => {
        scores[user.username] = user.GamePlayers.score;
    });
    return {
        game_id: game.id,
        scores: scores
    };
};

exports.dealCards = async (game_id, cardsPerPlayer) => {
    const game = await Game.findByPk(game_id, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }

    const deck = await createDeck(game_id);
    shuffle(deck);

    const players = game.Users;
    const hands = {};

    for (let i = 0; i < cardsPerPlayer; i++) {
        for (const player of players) {
            if (!hands[player.username]) {
                hands[player.username] = [];
            }
            const card = deck.pop();
            hands[player.username].push(`${card.color} ${card.value}`);
            await card.update({ userId: player.id });
        }
    }

    const topCard = deck.pop();
    game.topCard = `${topCard.color} ${topCard.value}`;
    await game.save();

    return hands;
};

exports.playCard = async (game_id, playerId, cardPlayed) => {
    console.log(`Attempting to play card for game ${game_id}, player ${playerId}, card ${cardPlayed}`);
    const game = await Game.findByPk(game_id, { include: User });
    if (!game) {
        console.error(`Game not found for ID: ${game_id}`);
        throw new Error("Game not found");
    }

    if (game.currentPlayerId !== playerId) {
        throw new Error("It's not your turn");
    }

    const cardToPlay = await Card.findByPk(cardPlayed);
    if (!cardToPlay) {
        throw new Error("Card not found");
    }

    if (cardToPlay.userId !== playerId) {
        throw new Error("You can only play your own cards");
    }

    const { color: playedColor, value: playedValue } = cardToPlay;

    const [topColor, topValue] = game.topCard.split(' ');

    console.log(`Top card: ${game.topCard}, Played card: ${playedColor} ${playedValue}`);

    if (!isValidPlay(playedColor, playedValue, topColor, topValue)) {
        console.error(`Invalid play: ${playedColor} ${playedValue} on top of ${game.topCard}`);
        throw new Error("Invalid play. The card must match the color or value of the top card.");
    }

    await cardToPlay.destroy();

    game.topCard = `${playedColor} ${playedValue}`;

    await applySpecialCardEffects(game, playedValue);

    game.currentPlayerId = await getNextPlayerId(game);

    await game.save();

    return { message: "Card played successfully", cardPlayed: `${playedColor} ${playedValue}`, newTopCard: game.topCard, nextPlayer: game.currentPlayerId };
};

exports.drawCard = async (gameId, playerId) => {
    const game = await Game.findByPk(gameId);
    if (!game) {
        throw new Error("Game not found");
    }

    const deck = await Card.findAll({ where: { gameId, userId: null } });
    let drawnCard, newHand = [];
    let playable = false;

    while (deck.length > 0 && !playable) {
        drawnCard = deck.pop();
        await drawnCard.update({ userId: playerId });
        newHand.push(`${drawnCard.color} ${drawnCard.value}`);

        if (isValidPlay(drawnCard.color, drawnCard.value, game.topCard.split(' ')[0], game.topCard.split(' ')[1])) {
            playable = true;
        }
    }

    return { newHand, drawnCard: `${drawnCard.color} ${drawnCard.value}`, playable };
};

exports.sayUno = async (gameId, playerId) => {
    const playerCards = await Card.count({ where: { gameId, userId: playerId } });
    if (playerCards !== 2) { 
        throw new Error("Player cannot say UNO at this time");
    }

    await User.update({ saidUno: true }, { where: { id: playerId } });

    return { message: "Player said UNO successfully" };
};

exports.challengeUno = async (gameId, challengerId, challengedPlayerId) => {
    const challengedPlayer = await User.findByPk(challengedPlayerId);
    const challengedPlayerCards = await Card.count({ where: { gameId, userId: challengedPlayerId } });
    
    if (challengedPlayerCards === 1 && !challengedPlayer.saidUno) {

        const drawnCards = await drawCards(gameId, challengedPlayerId, 2);
        await User.update({ saidUno: false }, { where: { id: challengedPlayerId } });
        return { 
            message: "Challenge successful. Challenged player draws 2 cards.",
            drawnCards 
        };
    } else {

        const drawnCards = await drawCards(gameId, challengerId, 1);
        return { 
            message: "Challenge failed. Challenger draws 1 card.",
            drawnCards 
        };
    }
};

exports.getGameState = async (gameId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }

    const hands = {};
    for (const user of game.Users) {
        const cards = await Card.findAll({ where: { gameId, userId: user.id } });
        hands[user.username] = cards.map(card => `${card.color} ${card.value}`);
    }

    return {
        currentPlayer: game.currentPlayerId,
        topCard: game.topCard,
        hands: hands
    };
};

exports.getPlayerHand = async (gameId, playerId) => {
    const cards = await Card.findAll({ where: { gameId, userId: playerId } });
    return cards.map(card => `${card.id} ${card.color} ${card.value}`);
};

exports.getScores = async (gameId) => {
    const game = await Game.findByPk(gameId, { include: User });
    if (!game) {
        throw new Error("Game not found");
    }

    const scores = {};
    for (const user of game.Users) {
        scores[user.username] = user.GamePlayers.score;
    }

    return scores;
};

async function createDeck(gameId) {
    const colors = ['Red', 'Blue', 'Green', 'Yellow'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw Two'];
    const deck = [];

    for (const color of colors) {
        for (const value of values) {
            deck.push(await Card.create({ color, value, gameId }));
        }
    }

    for (let i = 0; i < 4; i++) {
        deck.push(await Card.create({ color: 'Wild', value: 'Wild', gameId }));
        deck.push(await Card.create({ color: 'Wild', value: 'Draw Four', gameId }));
    }

    console.log(`Created deck for game ${gameId} with ${deck.length} cards`);
    return deck;
}

async function dealCards(game) {
    const players = game.Users;
    const hands = {};
    const cardsPerPlayer = 7; 

    const deck = await createDeck(game.id);
    shuffle(deck);

    for (const player of players) {
        hands[player.username] = [];
        for (let i = 0; i < cardsPerPlayer; i++) {
            const card = deck.pop();
            hands[player.username].push(`${card.color} ${card.value}`);
            await card.update({ userId: player.id });
        }
    }

    return hands;
}

async function drawCards(gameId, playerId, count) {
    const drawnCards = [];
    for (let i = 0; i < count; i++) {
        const card = await Card.findOne({ where: { gameId, userId: null } });
        if (card) {
            await card.update({ userId: playerId });
            drawnCards.push(`${card.color} ${card.value}`);
        } else {
            throw new Error("No cards left in the deck");
        }
    }
    return drawnCards;
}

async function selectInitialTopCard(gameId) {
    const cards = await Card.findAll({ where: { gameId, userId: null } });
    let topCard;
    do {
        topCard = cards[Math.floor(Math.random() * cards.length)];
    } while (topCard.color === 'Wild'); 
    return topCard;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isValidPlay(playedColor, playedValue, topColor, topValue) {
    console.log(`Validating play: ${playedColor} ${playedValue} on ${topColor} ${topValue}`);

    let playedValueNum;
    let topValueNum;

    if (!isNaN(parseInt(playedValue))) {
        playedValueNum = parseInt(playedValue);
    } else {
        playedValueNum = playedValue;
    }

    if (!isNaN(parseInt(topValue))) {
        topValueNum = parseInt(topValue);
    } else {
        topValueNum = topValue;
    }

    console.log(`Played color: ${playedColor}, Played value (numeric): ${playedValueNum}, Top color: ${topColor}, Top value (numeric): ${topValueNum}`);

    return playedColor === topColor || 
           playedValueNum === topValueNum || 
           playedColor === 'Wild' ||
           playedValue === 'Wild' ||
           playedValue === 'Draw Four';
}

async function applySpecialCardEffects(game, playedValue) {
    switch (playedValue) {
        case 'Skip':
            break;
        case 'Reverse':
            break;
        case 'Draw Two':
            const nextPlayerId = await getNextPlayerId(game);
            await drawCards(game.id, nextPlayerId, 2);
            break;
        case 'Draw Four':
            const nextPlayerIdForDrawFour = await getNextPlayerId(game);
            await drawCards(game.id, nextPlayerIdForDrawFour, 4);
            break;
    }
}

async function getNextPlayerId(game) {
    //tarea 7
}
