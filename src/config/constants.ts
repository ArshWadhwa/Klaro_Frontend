// Application constants

export const APP_NAME = 'Klaro';
export const APP_DESCRIPTION = 'AI-Powered Issue Tracker for Dev Teams';

// API Configuration
export const API_TIMEOUT = 120000;

// Token Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  CURRENT_ORG_ID: 'currentOrgId',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  GROUPS: '/groups',
  PROJECTS: '/projects',
  ISSUES: '/issues',
  ANALYTICS: '/analytics',
  ADMIN: '/admin',
  SETTINGS: '/settings',
  PENDING_INVITES: '/pending-invites',
  NO_ORGANIZATION: '/no-organization',
} as const;

// Issue Configuration
export const ISSUE_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const ISSUE_STATUSES = ['TO_DO', 'IN_PROGRESS', 'DONE'] as const;
export const ISSUE_TYPES = ['BUG', 'FEATURE', 'TASK'] as const;

// Priority Colors
export const PRIORITY_COLORS = {
  LOW: 'gray',
  MEDIUM: 'yellow',
  HIGH: 'red',
} as const;

// Status Colors
export const STATUS_COLORS = {
  TO_DO: 'gray',
  IN_PROGRESS: 'blue',
  DONE: 'green',
} as const;

// Type Colors
export const TYPE_COLORS = {
  BUG: 'red',
  FEATURE: 'purple',
  TASK: 'blue',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Polling intervals (in ms)
export const NOTIFICATION_POLL_INTERVAL = 30000; // 30 seconds

// User Roles
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
} as const;

// Org Roles
export const ORG_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;
