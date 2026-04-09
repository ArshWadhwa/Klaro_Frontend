// Notification store using Zustand

import { create } from 'zustand';
import { Notification } from '@/types/notification.types';
import { notificationsApi } from '@/lib/api/notifications.api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await notificationsApi.getUserNotifications();
      set({ notifications, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.error || 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const unreadCount = await notificationsApi.getUnreadCount();
      set({ unreadCount });
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      
      // Update local state
      const { notifications, unreadCount } = get();
      const updatedNotifications = notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      set({
        notifications: updatedNotifications,
        unreadCount: Math.max(0, unreadCount - 1),
      });
    } catch (error: any) {
      set({
        error: error?.response?.data?.error || 'Failed to mark notification as read',
      });
    }
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0, error: null });
  },
}));
