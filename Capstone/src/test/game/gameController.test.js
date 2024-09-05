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

  describe('dealCards', () => {
    it('should deal cards successfully', async () => {
      mockRequest.body = { game_id: 1, cardsPerPlayer: 5 };
      const mockHands = { 'Player 1': ['Red 0', 'Blue 5', 'Green 2'], 'Player 2': ['Yellow 7', 'Wild', 'Draw Two'] };
      gameServices.dealCards.mockResolvedValue(mockHands);

      await gameControllers.dealCards(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Cards dealt successfully.",
        players: mockHands
      });
    });

    it('should return 400 status on error', async () => {
      gameServices.dealCards.mockRejectedValue(new Error('Deal cards failed'));

      await gameControllers.dealCards(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Deal cards failed' });
    });
  });

  describe('playCard', () => {
    it('should play a card successfully', async () => {
      mockRequest.params = { game_id: 1, cardPlayed: 1 };
      const mockResult = { message: "Card played successfully", cardPlayed: "Red 5", newTopCard: "Blue 3", nextPlayer: 2 };
      gameServices.playCard.mockResolvedValue(mockResult);

      await gameControllers.playCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 404 status on "Game not found" error', async () => {
      gameServices.playCard.mockRejectedValue(new Error('Game not found'));

      await gameControllers.playCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Game not found' });
    });

    it('should return 400 status on other errors', async () => {
      gameServices.playCard.mockRejectedValue(new Error('Invalid play'));

      await gameControllers.playCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid play' });
    });
  });

  describe('drawCard', () => {
    it('should draw a card successfully', async () => {
      mockRequest.params = { game_id: 1 };
      const mockResult = { message: "Player drew a card from the deck.", cardDrawn: "Red 5" };
      gameServices.drawCard.mockResolvedValue(mockResult);

      await gameControllers.drawCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 status on error', async () => {
      gameServices.drawCard.mockRejectedValue(new Error('Draw card failed'));

      await gameControllers.drawCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Draw card failed' });
    });
  });

  describe('sayUno', () => {
    it('should allow a player to say UNO successfully', async () => {
      mockRequest.body = { game_id: 1 };
      const mockResult = { message: "Player said UNO successfully" };
      gameServices.sayUno.mockResolvedValue(mockResult);

      await gameControllers.sayUno(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 status on error', async () => {
      gameServices.sayUno.mockRejectedValue(new Error('Say UNO failed'));

      await gameControllers.sayUno(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Say UNO failed' });
    });
  });

  describe('challengeUno', () => {
    it('should challenge UNO successfully', async () => {
      mockRequest.body = { game_id: 1, challenged_player_id: 2 };
      const mockResult = { message: "Challenge successful. Challenged player draws 2 cards.", drawnCards: ['Red 5', 'Blue 3'] };
      gameServices.challengeUno.mockResolvedValue(mockResult);

      await gameControllers.challengeUno(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 status on error', async () => {
      gameServices.challengeUno.mockRejectedValue(new Error('Challenge UNO failed'));

      await gameControllers.challengeUno(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Challenge UNO failed' });
    });
  });

  describe('getGameState', () => {
    it('should get the current game state successfully', async () => {
      mockRequest.params = { game_id: 1 };
      const mockGameState = {
        currentPlayer: 1,
        topCard: 'Red 5',
        hands: {
          'Player 1': ['Blue 3', 'Green 7'],
          'Player 2': ['Yellow 2', 'Wild']
        }
      };
      gameServices.getGameState.mockResolvedValue(mockGameState);

      await gameControllers.getGameState(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockGameState);
    });

    it('should return 400 status on error', async () => {
      gameServices.getGameState.mockRejectedValue(new Error('Get game state failed'));

      await gameControllers.getGameState(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get game state failed' });
    });
  });

  describe('getPlayerHand', () => {
    it('should get the player\'s hand successfully', async () => {
      mockRequest.params = { game_id: 1 };
      const mockHand = ['Red 5', 'Green 2', 'Blue 7'];
      gameServices.getPlayerHand.mockResolvedValue(mockHand);

      await gameControllers.getPlayerHand(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ playerID: 1, hand: mockHand });
    });

    it('should return 400 status on error', async () => {
      gameServices.getPlayerHand.mockRejectedValue(new Error('Get player hand failed'));

      await gameControllers.getPlayerHand(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get player hand failed' });
    });
  });

  describe('getMoveHistory', () => {
    it('should get the move history successfully', async () => {
      mockRequest.params = { game_id: 1 };
      const mockHistory = [
        { player: 'Player 1', card: 'Red 5' },
        { player: 'Player 2', card: 'Blue 3' },
        { player: 'Player 1', card: 'Green 7' }
      ];
      gameServices.getMoveHistory.mockResolvedValue({ history: mockHistory });

      await gameControllers.getMoveHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ history: mockHistory });
    });

    it('should return 400 status on error', async () => {
      gameServices.getMoveHistory.mockRejectedValue(new Error('Get move history failed'));

      await gameControllers.getMoveHistory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Get move history failed' });
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