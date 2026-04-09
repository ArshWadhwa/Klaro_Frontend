'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Target, CheckCircle2, AlertTriangle, FolderKanban, Loader2, Users } from 'lucide-react';
import { projectsApi } from '@/lib/api/projects.api';
import { groupsApi } from '@/lib/api/groups.api';
import { issuesApi } from '@/lib/api/issues.api';
import { Project } from '@/types/project.types';
import { Issue } from '@/types/issue.types';
import toast from 'react-hot-toast';

interface ProjectStats {
  project: Project;
  issues: Issue[];
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  high: number;
  medium: number;
  low: number;
  bugs: number;
  features: number;
  tasks: number;
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([]);
  const [totalGroups, setTotalGroups] = useState(0);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [projects, groups] = await Promise.all([
        projectsApi.getUserProjects(),
        groupsApi.getUserGroups(),
      ]);

      setTotalGroups(groups.length);

      // Fetch issues for each project
      const stats: ProjectStats[] = await Promise.all(
        projects.map(async (project) => {
          const issues = await issuesApi.getIssuesByProject(project.id).catch(() => []);
          return {
            project,
            issues,
            total: issues.length,
            todo: issues.filter(i => i.status === 'TO_DO' || (i.status as string) === 'OPEN').length,
            inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
            done: issues.filter(i => i.status === 'DONE' || (i.status as string) === 'RESOLVED' || (i.status as string) === 'CLOSED').length,
            high: issues.filter(i => i.priority === 'HIGH').length,
            medium: issues.filter(i => i.priority === 'MEDIUM').length,
            low: issues.filter(i => i.priority === 'LOW').length,
            bugs: issues.filter(i => i.type === 'BUG').length,
            features: issues.filter(i => i.type === 'FEATURE').length,
            tasks: issues.filter(i => i.type === 'TASK').length,
          };
        })
      );

      setProjectStats(stats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  // Aggregate stats
  const totalProjects = projectStats.length;
  const totalIssues = projectStats.reduce((sum, p) => sum + p.total, 0);
  const totalTodo = projectStats.reduce((sum, p) => sum + p.todo, 0);
  const totalInProgress = projectStats.reduce((sum, p) => sum + p.inProgress, 0);
  const totalDone = projectStats.reduce((sum, p) => sum + p.done, 0);
  const totalHigh = projectStats.reduce((sum, p) => sum + p.high, 0);
  const totalMedium = projectStats.reduce((sum, p) => sum + p.medium, 0);
  const totalLow = projectStats.reduce((sum, p) => sum + p.low, 0);
  const totalBugs = projectStats.reduce((sum, p) => sum + p.bugs, 0);
  const totalFeatures = projectStats.reduce((sum, p) => sum + p.features, 0);
  const totalTasks = projectStats.reduce((sum, p) => sum + p.tasks, 0);
  const completionRate = totalIssues > 0 ? Math.round((totalDone / totalIssues) * 100) : 0;

  const pct = (val: number) => totalIssues > 0 ? Math.round((val / totalIssues) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time metrics from your projects and issues</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131316] border border-[#1f1f23] p-6 rounded-xl hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FolderKanban className="h-6 w-6 text-blue-400" />
            </div>
            <Users className="h-5 w-5 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-white">{totalProjects}</h3>
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-xs text-gray-500 mt-1">{totalGroups} group{totalGroups !== 1 ? 's' : ''}</p>
        </div>

        <div className="bg-[#131316] border border-[#1f1f23] p-6 rounded-xl hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <BarChart3 className="h-5 w-5 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-white">{totalIssues}</h3>
          <p className="text-sm text-gray-500">Total Issues</p>
          <p className="text-xs text-gray-500 mt-1">{totalInProgress} in progress</p>
        </div>

        <div className="bg-[#131316] border border-[#1f1f23] p-6 rounded-xl hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-gray-400">{completionRate}%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{totalDone}</h3>
          <p className="text-sm text-gray-500">Completed Issues</p>
          <div className="mt-2 bg-[#1a1a1d] rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="bg-[#131316] border border-[#1f1f23] p-6 rounded-xl hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{totalHigh}</h3>
          <p className="text-sm text-gray-500">High Priority Issues</p>
          <p className="text-xs text-red-400 mt-1">{totalHigh > 0 ? 'Needs attention' : 'All clear!'}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Issues by Status */}
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Issues by Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">To Do</span>
                <span className="text-sm font-medium text-white">{totalTodo} ({pct(totalTodo)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-gray-500 h-3 rounded-full transition-all" style={{ width: `${pct(totalTodo)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">In Progress</span>
                <span className="text-sm font-medium text-white">{totalInProgress} ({pct(totalInProgress)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${pct(totalInProgress)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">Done</span>
                <span className="text-sm font-medium text-white">{totalDone} ({pct(totalDone)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${pct(totalDone)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues by Priority */}
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Issues by Priority</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">High</span>
                <span className="text-sm font-medium text-white">{totalHigh} ({pct(totalHigh)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-red-500 h-3 rounded-full transition-all" style={{ width: `${pct(totalHigh)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">Medium</span>
                <span className="text-sm font-medium text-white">{totalMedium} ({pct(totalMedium)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full transition-all" style={{ width: `${pct(totalMedium)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">Low</span>
                <span className="text-sm font-medium text-white">{totalLow} ({pct(totalLow)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-gray-400 h-3 rounded-full transition-all" style={{ width: `${pct(totalLow)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues by Type */}
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Issues by Type</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">🐛 Bugs</span>
                <span className="text-sm font-medium text-white">{totalBugs} ({pct(totalBugs)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-red-400 h-3 rounded-full transition-all" style={{ width: `${pct(totalBugs)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">✨ Features</span>
                <span className="text-sm font-medium text-white">{totalFeatures} ({pct(totalFeatures)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full transition-all" style={{ width: `${pct(totalFeatures)}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">📋 Tasks</span>
                <span className="text-sm font-medium text-white">{totalTasks} ({pct(totalTasks)}%)</span>
              </div>
              <div className="bg-[#1a1a1d] rounded-full h-3">
                <div className="bg-blue-400 h-3 rounded-full transition-all" style={{ width: `${pct(totalTasks)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Performance Table */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Project Performance</h2>
        {projectStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f1f23]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Project</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Issues</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Done</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">In Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">To Do</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Completion</th>
                </tr>
              </thead>
              <tbody>
                {projectStats.map((ps) => {
                  const completion = ps.total > 0 ? Math.round((ps.done / ps.total) * 100) : 0;
                  return (
                    <tr key={ps.project.id} className="border-b border-[#1f1f23] hover:bg-[#1a1a1d]">
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-medium text-white">{ps.project.name}</span>
                          {ps.project.groupName && (
                            <p className="text-xs text-gray-500 mt-0.5">{ps.project.groupName}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-400">{ps.total}</td>
                      <td className="py-4 px-4 text-emerald-400">{ps.done}</td>
                      <td className="py-4 px-4 text-blue-400">{ps.inProgress}</td>
                      <td className="py-4 px-4 text-gray-400">{ps.todo}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#1a1a1d] rounded-full h-2 min-w-[60px]">
                            <div
                              className={`h-2 rounded-full transition-all ${completion === 100 ? 'bg-emerald-500' : completion >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                              style={{ width: `${completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-10 text-right">{completion}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FolderKanban className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No projects yet. Create a project to see analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
