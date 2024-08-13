const cardsController = require('../../controllers/cardsController');
const cardServices = require('../../services/cardServices');

// Mock the cardServices
jest.mock('../../services/cardServices');

describe('Cards Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCard', () => {
    it('should create a new card and return 201 status', async () => {
      const mockCard = { id: 1, color: 'red', value: '5', gameId: 1, createdAt: new Date() };
      cardServices.createCard.mockResolvedValue(mockCard);

      mockRequest.body = { color: 'red', value: '5', gameId: 1 };

      await cardsController.createCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCard);
    });

    it('should return 400 status on error', async () => {
      cardServices.createCard.mockRejectedValue(new Error('Creation failed'));

      mockRequest.body = { color: 'red', value: '5', gameId: 1 };

      await cardsController.createCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Creation failed' });
    });
  });

  describe('getCard', () => {
    it('should get a card and return it', async () => {
      const mockCard = { id: 1, color: 'red', value: '5', gameId: 1, createdAt: new Date() };
      cardServices.getCard.mockResolvedValue(mockCard);

      mockRequest.params = { id: '1' };

      await cardsController.getCard(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockCard);
    });

    it('should return 404 status if card is not found', async () => {
      cardServices.getCard.mockRejectedValue(new Error('Card not found'));

      mockRequest.params = { id: '1' };

      await cardsController.getCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });
  });

  describe('updateCard', () => {
    it('should update a card and return it', async () => {
      const mockCard = { id: 1, color: 'blue', value: '7', gameId: 2, createdAt: new Date() };
      cardServices.updateCard.mockResolvedValue(mockCard);

      mockRequest.params = { id: '1' };
      mockRequest.body = { color: 'blue', value: '7', gameId: 2 };

      await cardsController.updateCard(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockCard);
    });

    it('should return 400 status on error', async () => {
      cardServices.updateCard.mockRejectedValue(new Error('Update failed'));

      mockRequest.params = { id: '1' };
      mockRequest.body = { color: 'blue', value: '7', gameId: 2 };

      await cardsController.updateCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });

  describe('deleteCard', () => {
    it('should delete a card and return 204 status', async () => {
      cardServices.deleteCard.mockResolvedValue(undefined);

      mockRequest.params = { id: '1' };

      await cardsController.deleteCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 400 status on error', async () => {
      cardServices.deleteCard.mockRejectedValue(new Error('Deletion failed'));

      mockRequest.params = { id: '1' };

      await cardsController.deleteCard(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Deletion failed' });
    });
  });
});