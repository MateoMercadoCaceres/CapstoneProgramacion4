const playerControllers = require('../../controllers/playersController');
const playerServices = require('../../services/playerServices');

jest.mock('../../services/playerServices');

describe('Player Controllers', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlayer', () => {
    it('should create a new player and return 201 status', async () => {
      const mockPlayer = { id: 1, name: 'Test Player', age: 25, email: 'test@example.com', createdAt: new Date() };
      playerServices.createPlayer.mockResolvedValue(mockPlayer);

      mockRequest.body = { name: 'Test Player', age: 25, email: 'test@example.com' };

      await playerControllers.createPlayer(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockPlayer);
    });

    it('should return 400 status on error', async () => {
      playerServices.createPlayer.mockRejectedValue(new Error('Creation failed'));

      await playerControllers.createPlayer(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Creation failed' });
    });
  });

  describe('getPlayer', () => {
    it('should get a player and return it', async () => {
      const mockPlayer = { id: 1, name: 'Test Player', age: 25, email: 'test@example.com', createdAt: new Date() };
      playerServices.getPlayer.mockResolvedValue(mockPlayer);

      mockRequest.params = { id: '1' };

      await playerControllers.getPlayer(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith(mockPlayer);
    });

    it('should return 404 status if player is not found', async () => {
      playerServices.getPlayer.mockRejectedValue(new Error('Player not found'));

      mockRequest.params = { id: '1' };

      await playerControllers.getPlayer(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Player not found' });
    });

  });

  describe('Player Controllers', () => {
    let mockRequest;
    let mockResponse;
  
    beforeEach(() => {
      mockRequest = {
        body: {},
        params: {}
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createPlayer', () => {
      it('should create a new player and return 201 status', async () => {
        const mockPlayer = { id: 1, name: 'Test Player', age: 25, email: 'test@example.com', createdAt: new Date() };
        playerServices.createPlayer.mockResolvedValue(mockPlayer);
  
        mockRequest.body = { name: 'Test Player', age: 25, email: 'test@example.com' };
  
        await playerControllers.createPlayer(mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(mockPlayer);
      });
  
      it('should return 400 status on error', async () => {
        playerServices.createPlayer.mockRejectedValue(new Error('Creation failed'));
  
        await playerControllers.createPlayer(mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Creation failed' });
      });
    });
  
    describe('getPlayer', () => {
      it('should get a player and return it', async () => {
        const mockPlayer = { id: 1, name: 'Test Player', age: 25, email: 'test@example.com', createdAt: new Date() };
        playerServices.getPlayer.mockResolvedValue(mockPlayer);
  
        mockRequest.params = { id: '1' };
  
        await playerControllers.getPlayer(mockRequest, mockResponse);
  
        expect(mockResponse.json).toHaveBeenCalledWith(mockPlayer);
      });
  
      it('should return 404 status if player is not found', async () => {
        playerServices.getPlayer.mockRejectedValue(new Error('Player not found'));
  
        mockRequest.params = { id: '1' };
  
        await playerControllers.getPlayer(mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Player not found' });
      });
    });
  
    describe('updatePlayer', () => {
      it('should update a player and return the updated player', async () => {
        const mockPlayer = { id: 1, name: 'Updated Player', age: 26, email: 'updated@example.com', createdAt: new Date() };
        playerServices.updatePlayer.mockResolvedValue(mockPlayer);
  
        mockRequest.params = { id: '1' };
        mockRequest.body = { name: 'Updated Player', age: 26, email: 'updated@example.com' };
  
        await playerControllers.updatePlayer(mockRequest, mockResponse);
  
        expect(mockResponse.json).toHaveBeenCalledWith(mockPlayer);
      });
  
      it('should return 400 status if update fails', async () => {
        playerServices.updatePlayer.mockRejectedValue(new Error('Update failed'));
  
        mockRequest.params = { id: '1' };
        mockRequest.body = { name: 'Updated Player', age: 26, email: 'updated@example.com' };
  
        await playerControllers.updatePlayer(mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update failed' });
      });
    });
  
    describe('deletePlayer', () => {
      it('should delete a player if found', async () => {
        playerServices.deletePlayer.mockResolvedValue();
  
        mockRequest.params = { id: '1' };
  
        await playerControllers.deletePlayer(mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(204);
        expect(mockResponse.send).toHaveBeenCalled();
      });
  
      it('should return 400 status if delete fails', async () => {
        playerServices.deletePlayer.mockRejectedValue(new Error('Delete failed'));
  
        mockRequest.params = { id: '1' };
  
        await playerControllers.deletePlayer(mockRequest, mockResponse);
  
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Delete failed' });
      });
    });
  });
});