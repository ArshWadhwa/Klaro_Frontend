// Analytics related types

export interface DashboardStats {
  totalProjects: number;
  totalIssues: number;
  openIssues: number;
  completedIssues: number;
  highPriorityIssues: number;
  myAssignedIssues: number;
}

export interface IssueBreakdown {
  byStatus: {
    TO_DO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
  byPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
  byType: {
    BUG: number;
    FEATURE: number;
    TASK: number;
  };
}

export interface ProjectAnalytics {
  projectId: number;
  projectName: string;
  issueCount: number;
  completionRate: number;
  breakdown: IssueBreakdown;
}
