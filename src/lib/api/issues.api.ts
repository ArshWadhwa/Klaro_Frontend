// Issues API services

import apiClient from './client';
import {
  CreateIssueRequest,
  Issue,
  IssueDetails,
  IssueSearchFilters,
  UpdateIssueStatusRequest,
  UpdateIssuePriorityRequest,
  AIRecommendation,
  IssueStatus,
} from '@/types/issue.types';

export const issuesApi = {
  /**
   * Create a new issue
   * POST /api/issues
   */
  createIssue: async (data: CreateIssueRequest): Promise<Issue> => {
    const response = await apiClient.post('/api/issues', data);
    return response.data;
  },

  /**
   * Get issues by project
   * GET /api/issues/projects/{projectId}/issues
   */
  getIssuesByProject: async (projectId: number): Promise<Issue[]> => {
    const response = await apiClient.get(`/api/issues/projects/${projectId}/issues`);
    return response.data;
  },

  /**
   * Get issues (optionally filtered by status)
   * GET /api/issues/issues?status={status}
   */
  getIssues: async (status?: IssueStatus): Promise<Issue[]> => {
    const response = await apiClient.get('/api/issues/issues', {
      params: status ? { status } : {},
    });
    return response.data;
  },

  deleteIssue: async (issueId: number): Promise<string> => {
    const response = await apiClient.delete(`/api/issues/${issueId}/delete`);
    return response.data;
  },

  /**
   * Get issues assigned to current user
   * GET /api/issues/issues/assigned-to/me
   */
  getMyAssignedIssues: async (): Promise<Issue[]> => {
    const response = await apiClient.get('/api/issues/issues/assigned-to/me');
    return response.data;
  },

  /**
   * Search issues with filters
   * GET /api/issues/search
   */
  searchIssues: async (filters: IssueSearchFilters): Promise<Issue[]> => {
    const response = await apiClient.get('/api/issues/search', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get issue by ID
   * GET /api/issues/{issueId}
   */
  getIssueById: async (issueId: number): Promise<IssueDetails> => {
    const response = await apiClient.get(`/api/issues/${issueId}`);
    return response.data;
  },

  /**
   * Update issue status
   * PATCH /api/issues/{issueId}/status
   */
  updateIssueStatus: async (issueId: number, data: UpdateIssueStatusRequest): Promise<Issue> => {
    const response = await apiClient.patch(`/api/issues/${issueId}/status`, data);
    return response.data;
  },

  /**
   * Update issue priority
   * PATCH /api/issues/{issueId}/priority
   */
  updateIssuePriority: async (issueId: number, data: UpdateIssuePriorityRequest): Promise<Issue> => {
    const response = await apiClient.patch(`/api/issues/${issueId}/priority`, data);
    return response.data;
  },

  /**
   * Get AI recommendation for issue
   * GET /api/issues/{issueId}/ai-recommendation
   */
  getAIRecommendation: async (issueId: number): Promise<AIRecommendation> => {
    const response = await apiClient.get(`/api/issues/${issueId}/ai-recommendation`);
    return response.data;
  },

  /**
   * Update issue
   * PUT /api/issues/{issueId}
   */
  updateIssue: async (issueId: number, data: Partial<CreateIssueRequest>): Promise<Issue> => {
    const response = await apiClient.put(`/api/issues/${issueId}`, data);
    return response.data;
  },
};
