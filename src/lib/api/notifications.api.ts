// Notifications API services

import apiClient from './client';
import { Notification } from '@/types/notification.types';

export const notificationsApi = {
  /**
   * Get user notifications
   * GET /notifications/username
   */
  getUserNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications/username');
    return response.data;
  },

  /**
   * Get unread notification count
   * GET /notifications/unread-count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark notification as read
   * POST /notifications/{notificationId}/read
   */
  markAsRead: async (notificationId: number): Promise<string> => {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    return response.data;
  },
};
