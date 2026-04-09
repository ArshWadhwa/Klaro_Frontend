// Projects API services

import apiClient from './client';
import { CreateProjectRequest, Project, ProjectSummary } from '@/types/project.types';

export const projectsApi = {
  /**
   * Create a new project (Admin only)
   * POST /projects
   */
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  /**
   * Get user's projects
   * GET /projects
   */
  getUserProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  /**
   * Get all projects (Admin only)
   * GET /projects/all
   */
  getAllProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects/all');
    return response.data;
  },

  /**
   * Get projects by group
   * GET /projects/groups/{groupId}/projects
   */
  getProjectsByGroup: async (groupId: number): Promise<ProjectSummary[]> => {
    const response = await apiClient.get(`/projects/groups/${groupId}/projects`);
    return response.data;
  },

  /**
   * Delete a project (Admin/Owner only)
   * DELETE /projects/{projectId}
   */
  deleteProject: async (projectId: number): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}`);
  },
};
