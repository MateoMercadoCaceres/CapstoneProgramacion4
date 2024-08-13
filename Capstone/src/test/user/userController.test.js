const userControllers = require('../../controllers/userControllers');
const userServices = require('../../services/userServices');

jest.mock('../../services/userServices');

describe('User Controllers', () => {
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

  describe('login', () => {
    it('should return a token on successful login', async () => {
      userServices.login.mockResolvedValue('mockedtoken');
      mockRequest.body = { username: 'testuser', password: 'password' };

      await userControllers.login(mockRequest, mockResponse);

      expect(userServices.login).toHaveBeenCalledWith('testuser', 'password');
      expect(mockResponse.json).toHaveBeenCalledWith({ token: 'mockedtoken' });
    });

    it('should return 401 status on login failure', async () => {
      userServices.login.mockRejectedValue(new Error('Invalid credentials'));
      mockRequest.body = { username: 'testuser', password: 'wrongpassword' };

      await userControllers.login(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });

  describe('createUser', () => {
    it('should create a new user and return 201 status', async () => {
      userServices.createUser.mockResolvedValue({});
      mockRequest.body = { username: 'newuser', email: 'new@example.com', password: 'password' };

      await userControllers.createUser(mockRequest, mockResponse);

      expect(userServices.createUser).toHaveBeenCalledWith('newuser', 'new@example.com', 'password');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should return 400 status on user creation failure', async () => {
      userServices.createUser.mockRejectedValue(new Error('User already exists'));
      mockRequest.body = { username: 'existinguser', email: 'existing@example.com', password: 'password' };

      await userControllers.createUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      userServices.logout.mockResolvedValue({});
      mockRequest.body = { token: 'mockedtoken' };

      await userControllers.logout(mockRequest, mockResponse);

      expect(userServices.logout).toHaveBeenCalledWith('mockedtoken');
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User logged out successfully' });
    });

    it('should return 400 status on logout failure', async () => {
      userServices.logout.mockRejectedValue(new Error('Logout failed'));
      mockRequest.body = { token: 'invalidtoken' };

      await userControllers.logout(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Logout failed' });
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      const mockProfile = { username: 'testuser', email: 'test@example.com' };
      userServices.getUserProfile.mockResolvedValue(mockProfile);

      await userControllers.getUserProfile(mockRequest, mockResponse);

      expect(userServices.getUserProfile).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProfile);
    });

    it('should return 404 status when user profile is not found', async () => {
      userServices.getUserProfile.mockRejectedValue(new Error('User not found'));

      await userControllers.getUserProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated profile', async () => {
      const mockUpdatedUser = { id: 1, username: 'updateduser', email: 'updated@example.com', createdAt: new Date() };
      userServices.updateUser.mockResolvedValue(mockUpdatedUser);
      mockRequest.params = { id: '1' };
      mockRequest.body = { username: 'updateduser', email: 'updated@example.com', password: 'newpassword' };

      await userControllers.updateUser(mockRequest, mockResponse);

      expect(userServices.updateUser).toHaveBeenCalledWith('1', 'updateduser', 'updated@example.com', 'newpassword');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should return 400 status on update failure', async () => {
      userServices.updateUser.mockRejectedValue(new Error('Update failed'));
      mockRequest.params = { id: '1' };
      mockRequest.body = { username: 'updateduser', email: 'updated@example.com', password: 'newpassword' };

      await userControllers.updateUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });
});