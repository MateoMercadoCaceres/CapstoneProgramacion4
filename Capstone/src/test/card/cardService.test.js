const Card = require('../../models/cardModel');
const cardServices = require('../../services/cardServices');

// Mock del modelo Card
jest.mock('../../models/cardModel');

describe('Card Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCard', () => {
    it('should create a new card', async () => {
      const mockCard = { id: 1, color: 'red', value: '5', gameId: 1 };
      Card.create.mockResolvedValue(mockCard);

      const result = await cardServices.createCard('red', '5', 1);
      expect(result).toEqual(mockCard);
      expect(Card.create).toHaveBeenCalledWith({ color: 'red', value: '5', gameId: 1 });
    });
  });

  describe('getCard', () => {
    it('should return a card if found', async () => {
      const mockCard = { id: 1, color: 'red', value: '5', gameId: 1 };
      Card.findByPk.mockResolvedValue(mockCard);

      const result = await cardServices.getCard(1);
      expect(result).toEqual(mockCard);
      expect(Card.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw an error if card is not found', async () => {
      Card.findByPk.mockResolvedValue(null);

      await expect(cardServices.getCard(1)).rejects.toThrow('Card not found');
    });
  });

  describe('updateCard', () => {
    it('should update a card if found', async () => {
      const mockCard = { 
        id: 1, 
        color: 'red', 
        value: '5', 
        gameId: 1,
        update: jest.fn().mockResolvedValue(true)
      };
      const updatedCard = {
        id: 1,
        color: 'blue',
        value: '7',
        gameId: 2
      };
      Card.findByPk
        .mockResolvedValueOnce(mockCard)
        .mockResolvedValueOnce(updatedCard);
  
      const result = await cardServices.updateCard(1, 'blue', '7', 2);
      
      // Use toMatchObject instead of toEqual
      expect(result).toMatchObject({ id: 1, color: 'blue', value: '7', gameId: 2 });
      expect(mockCard.update).toHaveBeenCalledWith({ color: 'blue', value: '7', gameId: 2 });
    });
  });

  describe('deleteCard', () => {
    it('should delete a card if found', async () => {
      const mockCard = { 
        id: 1, 
        color: 'red', 
        value: '5', 
        gameId: 1,
        destroy: jest.fn().mockResolvedValue(undefined)
      };
      Card.findByPk.mockResolvedValue(mockCard);

      await cardServices.deleteCard(1);
      expect(mockCard.destroy).toHaveBeenCalled();
    });

    it('should throw an error if card is not found', async () => {
      Card.findByPk.mockResolvedValue(null);

      await expect(cardServices.deleteCard(1)).rejects.toThrow('Card not found');
    });
  });
});
