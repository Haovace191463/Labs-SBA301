import api from './api';

export const authService = {
  /**
   * Register a new user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserResponse>} { id, email, role }
   */
  async signup(email, password) {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },

  /**
   * Authenticate user with credentials
   * @param {string} email
   * @param {string} password
   * @returns {Promise<AuthResponse>} { accessToken, tokenType, expiresIn }
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Fetch current authenticated user info
   * @returns {Promise<{username: string, authorities: Array<{authority: string}>}>}
   */
  async getMe() {
    const response = await api.get('/users/me');
    return response.data;
  },

  /**
   * Fetch all users (protected endpoint)
   * @returns {Promise<Array<{id: number, email: string, role: string}>>}
   */
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },
};

export default authService;
