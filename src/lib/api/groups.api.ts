// Groups API services

import apiClient from './client';
import {
  CreateGroupRequest,
  Group,
  GroupDetails,
  GroupSummary,
} from '@/types/group.types';

export const groupsApi = {
  /**
   * Create a new group
   * POST /groups
   */
  createGroup: async (data: CreateGroupRequest): Promise<GroupDetails> => {
    const response = await apiClient.post('/groups', data);
    return response.data;
  },

  /**
   * Get user's groups
   * GET /groups
   */
  getUserGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/groups');
    return response.data;
  },

  /**
   * Get all groups
   * GET /groups/all
   */
  getAllGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/groups/all');
    return response.data;
  },

  /**
   * Get group by ID
   * GET /groups/{groupId}
   */
  getGroupById: async (groupId: number): Promise<GroupDetails> => {
    const response = await apiClient.get(`/groups/${groupId}`);
    return response.data;
  },

  /**
   * Search groups
   * GET /groups/search?query={query}
   */
  searchGroups: async (query: string): Promise<GroupSummary[]> => {
    const response = await apiClient.get('/groups/search', {
      params: { query },
    });
    return response.data;
  },

  /**
   * Add member to group
   * POST /groups/{groupId}/members
   */
  addMember: async (groupId: number, memberEmail: string): Promise<GroupDetails> => {
    const response = await apiClient.post(`/groups/${groupId}/members`, null, {
      params: { memberEmail },
    });
    return response.data;
  },

  /**
   * Add multiple members to group
   * POST /groups/{groupId}/members/batch
   */
  addMembers: async (groupId: number, memberEmails: string[]): Promise<GroupDetails> => {
    const response = await apiClient.post(`/groups/${groupId}/members/batch`, memberEmails);
    return response.data;
  },

  /**
   * Get group members
   * GET /groups/{groupId}/members
   */
  getGroupMembers: async (groupId: number): Promise<any[]> => {
    const response = await apiClient.get(`/groups/${groupId}/members`);
    return response.data;
  },

  /**
   * Get member emails for a group
   * GET /groups/{groupId}/member-emails
   */
  getGroupMemberEmails: async (groupId: number): Promise<string[]> => {
    const response = await apiClient.get(`/groups/${groupId}/member-emails`);
    return response.data;
  },

  /**
   * Remove member from group
   * DELETE /groups/{groupId}/members
   */
  removeMember: async (groupId: number, memberEmail: string): Promise<GroupDetails> => {
    const response = await apiClient.delete(`/groups/${groupId}/members`, {
      params: { memberEmail },
    });
    return response.data;
  },

  /**
   * Delete group
   * DELETE /groups/{groupId}
   */
  deleteGroup: async (groupId: number): Promise<string> => {
    const response = await apiClient.delete(`/groups/${groupId}`);
    return response.data;
  },

  /**
   * Get invite code for a group
   * GET /groups/{groupId}/invite-code
   */
  getInviteCode: async (groupId: number): Promise<{ inviteCode: string; groupId: string }> => {
    const response = await apiClient.get(`/groups/${groupId}/invite-code`);
    return response.data;
  },

  /**
   * Regenerate invite code for a group
   * POST /groups/{groupId}/regenerate-invite-code
   */
  regenerateInviteCode: async (groupId: number): Promise<{ inviteCode: string; message: string }> => {
    const response = await apiClient.post(`/groups/${groupId}/regenerate-invite-code`);
    return response.data;
  },

  /**
   * Join a group using invite code
   * POST /groups/join-by-code
   */
  joinByInviteCode: async (inviteCode: string): Promise<GroupDetails> => {
    const response = await apiClient.post('/groups/join-by-code', { inviteCode });
    return response.data;
  },
};
