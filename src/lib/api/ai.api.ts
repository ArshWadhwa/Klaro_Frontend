// AI API services

import apiClient from './client';
import { AIRecommendation } from '@/types/issue.types';

export const aiApi = {
  /**
   * Generate AI content (Public endpoint)
   * POST /ai/generate
   */
  generateContent: async (issueDescription: string): Promise<AIRecommendation> => {
    const response = await apiClient.post('/ai/generate', {
      issueDescription,
    });
    return response.data;
  },
};
