const playerServices = require('../../services/playerServices');
const Player = require('../../models/playerModel');

jest.mock('../../models/playerModel');

describe('Player Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlayer', () => {
    it('should create a new player', async () => {
      const mockPlayer = { id: 1, name: 'Test Player', age: 25, email: 'test@example.com' };
      Player.create.mockResolvedValue(mockPlayer);

      const result = await playerServices.createPlayer('Test Player', 25, 'test@example.com');
      expect(result).toEqual(mockPlayer);
      expect(Player.create).toHaveBeenCalledWith({ name: 'Test Player', age: 25, email: 'test@example.com' });
    });
  });

  describe('getPlayer', () => {
    it('should return a player if found', async () => {
      const mockPlayer = { id: 1, name: 'Test Player', age: 25, email: 'test@example.com' };
      Player.findByPk.mockResolvedValue(mockPlayer);

      const result = await playerServices.getPlayer(1);
      expect(result).toEqual(mockPlayer);
      expect(Player.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw an error if player is not found', async () => {
      Player.findByPk.mockResolvedValue(null);

      await expect(playerServices.getPlayer(1)).rejects.toThrow('Player not found');
    });
  });

  describe('updatePlayer', () => {
    it('should update a player if found', async () => {
        const mockPlayer = { 
            id: 1, 
            name: 'Test Player', 
            age: 25, 
            email: 'test@example.com',
            createdAt: new Date(),
            update: jest.fn().mockResolvedValue(true)
        };
        const updatedPlayer = {
            id: 1,
            name: 'Updated Player',
            age: 26,
            email: 'updated@example.com',
            createdAt: mockPlayer.createdAt
        };
        Player.findByPk
            .mockResolvedValueOnce(mockPlayer) // First call to findByPk
            .mockResolvedValueOnce(updatedPlayer); // Second call to findByPk after update

        const result = await playerServices.updatePlayer(1, 'Updated Player', 26, 'updated@example.com');
        expect(result).toEqual({
            id: 1,
            name: 'Updated Player',
            age: 26,
            email: 'updated@example.com',
            createdAt: expect.any(Date)
        });
        expect(Player.findByPk).toHaveBeenCalledWith(1);
        expect(mockPlayer.update).toHaveBeenCalledWith({ name: 'Updated Player', age: 26, email: 'updated@example.com' });
    });

    it('should throw an error if player is not found', async () => {
        Player.findByPk.mockResolvedValue(null);

        await expect(playerServices.updatePlayer(1, 'Updated Player', 26, 'updated@example.com')).rejects.toThrow('Player not found');
    });
});


  describe('deletePlayer', () => {
    it('should delete a player if found', async () => {
      const mockPlayer = { 
        id: 1, 
        destroy: jest.fn().mockResolvedValue(undefined)
      };
      Player.findByPk.mockResolvedValue(mockPlayer);

      await playerServices.deletePlayer(1);
      expect(mockPlayer.destroy).toHaveBeenCalled();
    });

    it('should throw an error if player is not found', async () => {
      Player.findByPk.mockResolvedValue(null);

      await expect(playerServices.deletePlayer(1)).rejects.toThrow('Player not found');
    });
  });
});