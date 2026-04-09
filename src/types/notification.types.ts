// Notification related types

export interface Notification {
  id: number;
  recipient: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationCount {
  unreadCount: number;
}
