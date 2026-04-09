// Issue related types

export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type IssueStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';
export type IssueType = 'BUG' | 'FEATURE' | 'TASK';

export interface CreateIssueRequest {
  projectId: number;
  title: string;
  description?: string;
  priority: IssuePriority;
  status: IssueStatus;
  type: IssueType;
  assigneeId?: number;
}

export interface Issue {
  id: number;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  assignedTo?: string;
  assigneeId?: number;
  createdBy: string;
  createdById?: number;
  projectId: number;
  projectName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IssueDetails extends Issue {
  comments?: Comment[];
}

export interface UpdateIssueStatusRequest {
  status: IssueStatus;
}

export interface UpdateIssuePriorityRequest {
  priority: IssuePriority;
}

export interface IssueSearchFilters {
  status?: IssueStatus;
  priority?: IssuePriority;
  type?: IssueType;
  projectId?: number;
  assigneeId?: number;
}
export interface DeleteIssueRequest {
  issueId: number;
}

export interface AIRecommendation {
  aiSuggestion: string;
}
