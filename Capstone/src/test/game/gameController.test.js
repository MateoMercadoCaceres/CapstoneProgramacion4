const gameControllers = require('../../controllers/gameControllers');
const gameServices = require('../../services/gameServices');

jest.mock('../../services/gameServices');

describe('Game Controllers', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      userId: 1
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    it('should create a new game and return 201 status', async () => {
      const mockGame = { id: 1 };
      gameServices.createGame.mockResolvedValue(mockGame);

      mockRequest.body = { 
        name: 'Test Game', 
        rules: 'Test Rules',
        maxPlayers: 4};

      await gameControllers.createGame(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: "Game created successfully", 
        game_id: 1 
      });
    });

    it('should return 400 status on error', async () => {
      gameServices.createGame.mockRejectedValue(new Error('Creation failed'));

      await gameControllers.createGame(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Creation failed' });
    });
  });

  describe('joinGame', () => {
    it('should join a game successfully', async () => {
      mockRequest.body = { game_id: 1 };
      gameServices.joinGame.mockResolvedValue();

      await gameControllers.joinGame(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({ message: "User joined the game successfully" });
    });

    it('should return 400 status on error', async () => {
      gameServices.joinGame.mockRejectedValue(new Error('Join failed'));

      await gameControllers.joinGame(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Join failed' });
    });
  });

  describe('startGame', () => {
    it('should start a game successfully', async () => {
      mockRequest.body = { game_id: 1 };
      gameServices.startGame.mockResolvedValue();

      await gameControllers.startGame(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Game started successfully" });
    });

    it('should return 400 status on error', async () => {
      gameServices.startGame.mockRejectedValue(new Error('Start failed'));

      await gameControllers.startGame(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Start failed' });
    });
  });

  describe('leaveGame', () => {
    it('should leave a game successfully', async () => {
      mockRequest.body = { game_id: 1 };
      gameServices.leaveGame.mockResolvedValue();

      await gameControllers.leaveGame(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({ message: "User left the game successfully" });
    });

    it('should return 400 status on error', async () => {
      gameServices.leaveGame.mockRejectedValue(new Error('Leave failed'));

      await gameControllers.leaveGame(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Leave failed' });
    });
  });

  describe('getPlayers', () => {
    it('should get players successfully', async () => {
      mockRequest.params = { game_id: 1 };
      const mockPlayers = [{ id: 1, name: 'Player 1' }, { id: 2, name: 'Player 2' }];
      gameServices.getPlayers.mockResolvedValue(mockPlayers);

      await gameControllers.getPlayers(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockPlayers);
    });

    it('should return 400 status on error', async () => {
      gameServices.getPlayers.mockRejectedValue(new Error('Get players failed'));

      await gameControllers.getPlayers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get players failed' });
    });
  });

  describe('getCurrentPlayer', () => {
    it('should get current player successfully', async () => {
      mockRequest.params = { game_id: 1 };
      const mockCurrentPlayer = { id: 1, name: 'Current Player' };
      gameServices.getCurrentPlayer.mockResolvedValue(mockCurrentPlayer);

      await gameControllers.getCurrentPlayer(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockCurrentPlayer);
    });

    it('should return 400 status on error', async () => {
      gameServices.getCurrentPlayer.mockRejectedValue(new Error('Get current player failed'));

      await gameControllers.getCurrentPlayer(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get current player failed' });
    });
  });

  describe('getTopCard', () => {
    it('should get top card successfully', async () => {
      mockRequest.params = { game_id: 1 };
      const mockTopCard = { id: 1, color: 'red', value: '7' };
      gameServices.getTopCard.mockResolvedValue(mockTopCard);

      await gameControllers.getTopCard(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockTopCard);
    });

    it('should return 400 status on error', async () => {
      gameServices.getTopCard.mockRejectedValue(new Error('Get top card failed'));

      await gameControllers.getTopCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get top card failed' });
    });
  });

  describe('getScores', () => {
    it('should get scores successfully', async () => {
      mockRequest.params = { game_id: 1 };
      const mockScores = [{ playerId: 1, score: 10 }, { playerId: 2, score: 5 }];
      gameServices.getScores.mockResolvedValue(mockScores);

      await gameControllers.getScores(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockScores);
    });

    it('should return 400 status on error', async () => {
      gameServices.getScores.mockRejectedValue(new Error('Get scores failed'));

      await gameControllers.getScores(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get scores failed' });
    });
  });
});