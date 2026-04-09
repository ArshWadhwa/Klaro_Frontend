// Analytics API services

import apiClient from './client';
import { DashboardStats, ProjectAnalytics } from '@/types/analytics.types';

export const analyticsApi = {
  /**
   * Get dashboard analytics
   * GET /api/analytics/dashboard
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/api/analytics/dashboard');
    return response.data;
  },

  /**
   * Get project analytics
   * GET /api/analytics/project/{projectId}
   */
  getProjectAnalytics: async (projectId: number): Promise<ProjectAnalytics> => {
    const response = await apiClient.get(`/api/analytics/project/${projectId}`);
    return response.data;
  },
};
