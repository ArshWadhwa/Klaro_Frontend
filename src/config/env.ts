// Environment configuration

export const env = {
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL || '/api').trim(),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
