// Comments API services

import apiClient from './client';
import { CreateCommentRequest, Comment } from '@/types/comment.types';

export const commentsApi = {
  /**
   * Add comment to issue
   * POST /comments/issue/{issueId}
   */
  addComment: async (issueId: number, data: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post(`/comments/issue/${issueId}`, data);
    return response.data;
  },

  /**
   * Get comments for issue
   * GET /comments/issue/{issueId}
   */
  getCommentsByIssue: async (issueId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/comments/issue/${issueId}`);
    return response.data;
  },
};
