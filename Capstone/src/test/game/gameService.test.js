jest.mock('../../models/gameModel', () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
  belongsTo: jest.fn()
}));

jest.mock('../../models/userModel', () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
  update: jest.fn()
}));

jest.mock('../../models/cardModel', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn()
}));

const gameServices = require('../../services/gameServices');

const Game = require('../../models/gameModel');
const User = require('../../models/userModel');
const Card = require('../../models/cardModel');

describe('Game Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    it('should create a new game', async () => {
      const mockNewGame = { id: 1, name: 'Test Game', maxPlayers: 4 };
      Game.create.mockResolvedValue(mockNewGame);
  
      const result = await gameServices.createGame('Test Game', 'Test Rules', 1, 4);
      expect(result).toEqual(mockNewGame);
      expect(Game.create).toHaveBeenCalledWith({ 
        name: 'Test Game', 
        rules: 'Test Rules', 
        creatorId: 1,
        maxPlayers: 4});
    });
  });
  
  describe('joinGame', () => {
    it('should add a user to the game', async () => {
      const mockGameInstance = { 
        id: 1, 
        addUser: jest.fn().mockResolvedValue(undefined),
        Users: []
      };
      const mockUserInstance = { id: 1 };
      Game.findByPk.mockResolvedValue(mockGameInstance);
      User.findByPk.mockResolvedValue(mockUserInstance);
  
      await gameServices.joinGame(1, 1);
      expect(Game.findByPk).toHaveBeenCalledWith(1, {"include": [{"model": User}]});
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockGameInstance.addUser).toHaveBeenCalledWith(mockUserInstance);
    });
  
    it('should throw an error if game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.joinGame(1, 1)).rejects.toThrow('Game not found');
    });
  });

  describe('startGame', () => {
    it('should start the game if conditions are met', async () => {
      const mockGame = { 
        id: 1, 
        creatorId: 1, 
        state: 'waiting',
        save: jest.fn(),
        Users: [{ id: 1, username: 'player1' }]
      };
      Game.findByPk.mockResolvedValue(mockGame);
      Card.create.mockImplementation((card) => card);
      Card.findAll.mockResolvedValue([{ color: 'Red', value: '5' }]);

      const result = await gameServices.startGame(1, 1);
      expect(mockGame.state).toBe('in_progress');
      expect(mockGame.save).toHaveBeenCalled();
      expect(result).toHaveProperty('hands');
      expect(result).toHaveProperty('topCard');
      expect(result).toHaveProperty('firstPlayer');
    });

    it('should throw an error if game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.startGame(1, 1)).rejects.toThrow('Game not found');
    });

    it('should throw an error if user is not the creator', async () => {
      const mockGame = { id: 1, creatorId: 2, state: 'waiting' };
      Game.findByPk.mockResolvedValue(mockGame);
      await expect(gameServices.startGame(1, 1)).rejects.toThrow('Only the game creator can start the game');
    });

    it('should throw an error if game is not in waiting state', async () => {
      const mockGame = { id: 1, creatorId: 1, state: 'in_progress' };
      Game.findByPk.mockResolvedValue(mockGame);
      await expect(gameServices.startGame(1, 1)).rejects.toThrow('Game is not in waiting state');
    });
  });

  describe('leaveGame', () => {
    it('should remove a user from the game', async () => {
      const mockUser = { id: 1 };
      const mockGame = { id: 1, removeUser: jest.fn() };
      Game.findByPk.mockResolvedValue(mockGame);
      User.findByPk.mockResolvedValue(mockUser);

      await gameServices.leaveGame(1, 1);
      expect(Game.findByPk).toHaveBeenCalledWith(1, { include: User });
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockGame.removeUser).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.leaveGame(1, 1)).rejects.toThrow('Game not found');
    });
  });

  describe('getPlayers', () => {
    it('should return the list of players in the game', async () => {
      const mockGame = { 
        id: 1, 
        Users: [{ username: 'player1' }, { username: 'player2' }]
      };
      Game.findByPk.mockResolvedValue(mockGame);

      const result = await gameServices.getPlayers(1);
      expect(result).toEqual({
        game_id: 1,
        players: ['player1', 'player2']
      });
    });

    it('should throw an error if game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.getPlayers(1)).rejects.toThrow('Game not found');
    });
  });

  describe('getCurrentPlayer', () => {
    it('should return the current player', async () => {
      const mockGame = { 
        id: 1, 
        currentPlayerId: 2,
        Users: [{ id: 1, username: 'player1' }, { id: 2, username: 'player2' }]
      };
      Game.findByPk.mockResolvedValue(mockGame);

      const result = await gameServices.getCurrentPlayer(1);
      expect(result).toEqual({
        game_id: 1,
        current_player: 'player2'
      });
    });

    it('should return null if there is no current player', async () => {
      const mockGame = { 
        id: 1, 
        currentPlayerId: null,
        Users: [{ id: 1, username: 'player1' }, { id: 2, username: 'player2' }]
      };
      Game.findByPk.mockResolvedValue(mockGame);

      const result = await gameServices.getCurrentPlayer(1);
      expect(result).toEqual({
        game_id: 1,
        current_player: null
      });
    });

    it('should throw an error if game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.getCurrentPlayer(1)).rejects.toThrow('Game not found');
    });
  });

  describe('getTopCard', () => {
    it('should return the top card of the game', async () => {
      const mockGame = { id: 1, topCard: 'Ace of Spades' };
      Game.findByPk.mockResolvedValue(mockGame);

      const result = await gameServices.getTopCard(1);
      expect(result).toEqual({
        game_id: 1,
        top_card: 'Ace of Spades'
      });
    });

    it('should throw an error if game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.getTopCard(1)).rejects.toThrow('Game not found');
    });
  });

  describe('drawCard', () => {
    it('should allow a player to draw a card from the deck', async () => {
      const mockGame = { id: 1, topCard: 'Red 5' };
      Game.findByPk.mockResolvedValue(mockGame);
      const mockCard = { color: 'Red', value: '5', update: jest.fn() };
      Card.findAll.mockResolvedValue([mockCard]);

      const result = await gameServices.drawCard(1, 1);
      expect(result).toHaveProperty('newHand');
      expect(result).toHaveProperty('drawnCard');
      expect(result).toHaveProperty('playable');
      expect(mockCard.update).toHaveBeenCalledWith({ userId: 1 });
    });

    it('should throw an error if there are no cards left in the deck', async () => {
      const mockGame = { id: 1, topCard: 'Red 5' };
      Game.findByPk.mockResolvedValue(mockGame);
      Card.findAll.mockResolvedValue([]);

      await expect(gameServices.drawCard(1, 1)).rejects.toThrow('No cards left in the deck');
    });
  });

  describe('sayUno', () => {
    it('should allow a player to say UNO if they have 2 cards', async () => {
      const mockUser = { id: 1, saidUno: false };
      User.findByPk.mockResolvedValue(mockUser);
      Card.count.mockResolvedValue(2);

      const result = await gameServices.sayUno(1, 1);
      expect(result).toEqual({ message: 'Player said UNO successfully' });
      expect(User.update).toHaveBeenCalledWith({ saidUno: true }, { where: { id: 1 } });
    });

    it('should throw an error if the player has more or less than 2 cards', async () => {
      const mockUser = { id: 1, saidUno: false };
      User.findByPk.mockResolvedValue(mockUser);
      Card.count.mockResolvedValue(3);

      await expect(gameServices.sayUno(1, 1)).rejects.toThrow('Player cannot say UNO at this time');
    });
  });

  describe('challengeUno', () => {
    it('should award 2 cards to the challenged player if they did not say UNO', async () => {
      const mockChallengedPlayer = { id: 2, saidUno: false };
      User.findByPk.mockResolvedValue(mockChallengedPlayer);
      Card.count.mockResolvedValue(1);
      gameServices.drawCards = jest.fn().mockResolvedValue(['Red 5', 'Blue 2']);

      const result = await gameServices.challengeUno(1, 1, 2);
      expect(result).toEqual({
        message: 'Challenge successful. Challenged player draws 2 cards.',
        drawnCards: ['Red 5', 'Blue 2']
      });
      expect(User.update).toHaveBeenCalledWith({ saidUno: false }, { where: { id: 2 } });
    });

    it('should award 1 card to the challenger if the challenged player said UNO', async () => {
      const mockChallengedPlayer = { id: 2, saidUno: true };
      User.findByPk.mockResolvedValue(mockChallengedPlayer);
      gameServices.drawCards = jest.fn().mockResolvedValue(['Green 3']);

      const result = await gameServices.challengeUno(1, 1, 2);
      expect(result).toEqual({
        message: 'Challenge failed. Challenger draws 1 card.',
        drawnCards: ['Green 3']
      });
    });
  });

  describe('getGameState', () => {
    it('should return the current game state', async () => {
      const mockGame = {
        id: 1,
        currentPlayerId: 2,
        topCard: 'Red 5',
        Users: [
          { id: 1, username: 'player1' },
          { id: 2, username: 'player2' }
        ]
      };
      const mockCards = [
        { color: 'Red', value: '2' },
        { color: 'Blue', value: '7' }
      ];
      Game.findByPk.mockResolvedValue(mockGame);
      Card.findAll.mockResolvedValue(mockCards);

      const result = await gameServices.getGameState(1);
      expect(result).toEqual({
        currentPlayer: 2,
        topCard: 'Red 5',
        hands: {
          player1: ['Red 2', 'Blue 7'],
          player2: ['Red 2', 'Blue 7']
        }
      });
    });

    it('should throw an error if the game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.getGameState(1)).rejects.toThrow('Game not found');
    });
  });

  describe('getPlayerHand', () => {
    it('should return the cards in a player\'s hand', async () => {
      const mockCards = [
        { id: 1, color: 'Red', value: '2' },
        { id: 2, color: 'Blue', value: '7' }
      ];
      Card.findAll.mockResolvedValue(mockCards);

      const result = await gameServices.getPlayerHand(1, 1);
      expect(result).toEqual(['1 Red 2', '2 Blue 7']);
    });
  });

  describe('getScores', () => {
    it('should return the scores of all players in the game', async () => {
      const mockGame = {
        id: 1,
        Users: [
          { username: 'player1', GamePlayers: { score: 10 } },
          { username: 'player2', GamePlayers: { score: 20 } }
        ]
      };
      Game.findByPk.mockResolvedValue(mockGame);

      const result = await gameServices.getScores(1);
      expect(result).toEqual({
        player1: 10,
        player2: 20
      });
    });

    it('should throw an error if the game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.getScores(1)).rejects.toThrow('Game not found');
    });
  });
});