// Formatters for dates, strings, etc.

import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format date to human-readable string
 */
export const formatDate = (date: string | Date, formatString: string = 'PPP'): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatString);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

/**
 * Truncate string to specified length
 */
export const truncate = (str: string, length: number = 50): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format enum value to display string
 */
export const formatEnumValue = (value: string): string => {
  return value
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Get initials from full name
 */
export const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};
