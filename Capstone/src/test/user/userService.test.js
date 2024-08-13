const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userServices = require('../../services/userServices');
const User = require('../../models/userModel');
const BlacklistedToken = require('../../models/blacklistModel');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../models/userModel');
jest.mock('../../models/blacklistModel');

describe('User Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token when credentials are valid', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue('mockedtoken');

      const result = await userServices.login('testuser', 'password');
      expect(result).toBe('mockedtoken');
      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, username: 'testuser' },
        'your_secret_key',
        { expiresIn: '1h' }
      );
    });

    it('should throw an error when user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(userServices.login('testuser', 'password')).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error when password is incorrect', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(false);

      await expect(userServices.login('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('createUser', () => {
    it('should create a new user when email is unique', async () => {
      User.findOne.mockResolvedValue(null);
      const mockCreatedUser = { id: 1, username: 'newuser', email: 'new@example.com' };
      User.create.mockResolvedValue(mockCreatedUser);

      const result = await userServices.createUser('newuser', 'new@example.com', 'password');
      expect(result).toEqual(mockCreatedUser);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
      expect(User.create).toHaveBeenCalledWith({ username: 'newuser', email: 'new@example.com', password: 'password' });
    });

    it('should throw an error when email already exists', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'existing@example.com' });

      await expect(userServices.createUser('newuser', 'existing@example.com', 'password')).rejects.toThrow('User already exists');
    });
  });

  describe('logout', () => {
    it('should blacklist the token', async () => {
      const mockToken = 'mockedtoken';
      const mockDecodedToken = { exp: Math.floor(Date.now() / 1000) + 3600 };
      jwt.decode.mockReturnValue(mockDecodedToken);
      BlacklistedToken.create.mockResolvedValue({ token: mockToken });

      await userServices.logout(mockToken);
      expect(jwt.decode).toHaveBeenCalledWith(mockToken);
      expect(BlacklistedToken.create).toHaveBeenCalledWith({
        token: mockToken,
        expiresAt: expect.any(Date)
      });
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile when user exists', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      User.findByPk.mockResolvedValue(mockUser);

      const result = await userServices.getUserProfile(1);
      expect(result).toEqual({ username: 'testuser', email: 'test@example.com' });
      expect(User.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw an error when user is not found', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(userServices.getUserProfile(1)).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user when user exists', async () => {
        const mockUser = { 
            id: 1, 
            username: 'olduser', 
            email: 'old@example.com',
            createdAt: new Date(),
            update: jest.fn().mockResolvedValue(true)
        };
        const updatedUser = {
            id: 1,
            username: 'newuser',
            email: 'new@example.com',
            createdAt: mockUser.createdAt
        };
        User.findByPk
            .mockResolvedValueOnce(mockUser) 
            .mockResolvedValueOnce(updatedUser); 

        const result = await userServices.updateUser(1, 'newuser', 'new@example.com', 'newpassword');
        expect(result).toEqual({
            id: 1,
            username: 'newuser',
            email: 'new@example.com',
            createdAt: expect.any(Date)
        });
        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(mockUser.update).toHaveBeenCalledWith({ username: 'newuser', email: 'new@example.com', password: 'newpassword' });
    });

    it('should throw an error when user is not found', async () => {
        User.findByPk.mockResolvedValue(null);

        await expect(userServices.updateUser(1, 'newuser', 'new@example.com', 'newpassword')).rejects.toThrow('User not found');
    });
  });

});