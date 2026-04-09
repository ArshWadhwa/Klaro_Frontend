// Admin API services

import apiClient from './client';
import { User } from '@/types/user.types';

export const adminApi = {
  /**
   * Get all users (Admin only)
   * GET /admin/users
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  /**
   * Get available users for group assignment (Admin only)
   * GET /admin/users/available?groupId={groupId}
   */
  getAvailableUsers: async (groupId?: number): Promise<User[]> => {
    const response = await apiClient.get('/admin/users/available', {
      params: groupId ? { groupId } : {},
    });
    return response.data;
  },

  /**
   * Get system statistics (Admin only)
   * GET /admin/stats
   */
  getSystemStats: async (): Promise<string> => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
};
