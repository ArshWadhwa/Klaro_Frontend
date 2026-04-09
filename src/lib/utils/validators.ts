// Form validators

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate password match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validate required field
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate string length
 */
export const isValidLength = (value: string, min: number, max?: number): boolean => {
  const length = value.trim().length;
  if (max) {
    return length >= min && length <= max;
  }
  return length >= min;
};
