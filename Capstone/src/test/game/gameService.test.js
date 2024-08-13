jest.mock('../../models/gameModel', () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  belongsToMany: jest.fn(),
  belongsTo: jest.fn()
}));

jest.mock('../../models/userModel', () => ({
  findByPk: jest.fn(),
  belongsToMany: jest.fn()
}));

const gameServices = require('../../services/gameServices');

const Game = require('../../models/gameModel');
const User = require('../../models/userModel');

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
        addUser: jest.fn().mockResolvedValue(undefined) 
      };
      const mockUserInstance = { id: 1 };
      Game.findByPk.mockResolvedValue(mockGameInstance);
      User.findByPk.mockResolvedValue(mockUserInstance);
  
      await gameServices.joinGame(1, 1);
      expect(Game.findByPk).toHaveBeenCalledWith(1);
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
        save: jest.fn()
      };
      Game.findByPk.mockResolvedValue(mockGame);

      await gameServices.startGame(1, 1);
      expect(mockGame.state).toBe('in_progress');
      expect(mockGame.save).toHaveBeenCalled();
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
        game_id: 1,
        scores: {
          player1: 10,
          player2: 20
        }
      });
    });

    it('should throw an error if game is not found', async () => {
      Game.findByPk.mockResolvedValue(null);
      await expect(gameServices.getScores(1)).rejects.toThrow('Game not found');
    });
  });
});