// Authentication API services

import apiClient from './client';
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth.types';
import { User } from '@/types/user.types';

export const authApi = {
  /**
   * Register a new user
   * POST /auth/signup
   */
  signup: async (data: SignupRequest): Promise<string> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  /**
   * Login user
   * POST /auth/signin
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signin', credentials);
    return response.data;
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post('/auth/refresh', data);
    return response.data;
  },

  /**
   * Get current user information
   * GET /auth/user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/user');
    return response.data;
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async (): Promise<string> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Get available users (public endpoint)
   * GET /users/available
   */
  getAvailableUsers: async (): Promise<any[]> => {
    const response = await apiClient.get('/users/available');
    return response.data;
  },
};
