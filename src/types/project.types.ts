// Project related types

export interface CreateProjectRequest {
  name: string;
  description?: string;
  groupId?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  groupName?: string;
  groupId?: number;
}

export interface ProjectSummary {
  id: number;
  name: string;
  createdBy: string;
  groupName?: string;
}

export interface ProjectStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  completedIssues: number;
  highPriorityIssues: number;
}
