'use client';

import { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  AlertCircle, 
  Clock,
  TrendingUp,
  Loader2
  
} from 'lucide-react';

import Link from 'next/link';
import { projectsApi } from '@/lib/api/projects.api';
import { groupsApi } from '@/lib/api/groups.api';
import { apiClient } from '@/lib/api/client';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalProjects: number;
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  highPriorityIssues: number;
  myAssignedIssues: number;
  totalGroups: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalIssues: 0,
    openIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
    highPriorityIssues: 0,
    myAssignedIssues: 0,
    totalGroups: 0,
  });
  const [recentIssues, setRecentIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [projects, groups, myIssues] = await Promise.all([
        projectsApi.getUserProjects(),
        groupsApi.getUserGroups(),
        apiClient.get('/api/issues/issues/assigned-to/me').then(res => res.data),
      ]);

      // Fetch issues only from user's own projects (not all DB issues)
      const projectIssueArrays = await Promise.all(
        projects.map((p: any) =>
          apiClient.get(`/api/issues/projects/${p.id}/issues`).then(res => res.data).catch(() => [])
        )
      );
      const allIssues = projectIssueArrays.flat();

      // Calculate statistics
      const openIssues = allIssues.filter((i: any) => 
        i.status === 'OPEN' || i.status === 'TO_DO'
      ).length;
      
      const inProgressIssues = allIssues.filter((i: any) => 
        i.status === 'IN_PROGRESS'
      ).length;
      
      const resolvedIssues = allIssues.filter((i: any) => 
        i.status === 'RESOLVED' || i.status === 'DONE' || i.status === 'CLOSED'
      ).length;
      
      const highPriorityIssues = allIssues.filter((i: any) => 
        i.priority === 'HIGH'
      ).length;

      setStats({
        totalProjects: projects.length,
        totalIssues: allIssues.length,
        openIssues,
        inProgressIssues,
        resolvedIssues,
        highPriorityIssues,
        myAssignedIssues: myIssues.length,
        totalGroups: groups.length,
      });

      // Get 5 most recent issues (sort by ID descending as a simple approach)
      const recent = [...allIssues]
        .sort((a: any, b: any) => b.id - a.id)
        .slice(0, 5);
      setRecentIssues(recent);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'bg-red-500/10 text-red-400';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-400';
      case 'LOW': return 'bg-green-500/10 text-green-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
      case 'TO_DO':
        return 'bg-blue-500/10 text-blue-400';
      case 'IN_PROGRESS':
        return 'bg-purple-500/10 text-purple-400';
      case 'RESOLVED':
      case 'DONE':
      case 'CLOSED':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's an overview of your projects and issues.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Projects */}
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Projects</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalProjects}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FolderKanban className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <Link href="/projects" className="text-sm text-blue-400 hover:text-blue-300 mt-4 inline-block">
            View all →
          </Link>
        </div>

        {/* Total Issues */}
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Issues</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalIssues}</p>
            </div>
            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {stats.openIssues} open · {stats.inProgressIssues} in progress
          </p>
        </div>

        {/* My Assigned Issues */}
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Assigned to Me</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.myAssignedIssues}</p>
            </div>
            <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Issues waiting for you
          </p>
        </div>

        {/* High Priority Issues */}
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">High Priority</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{stats.highPriorityIssues}</p>
            </div>
            <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Need immediate attention
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
          <p className="text-blue-200 text-sm font-medium">Open Issues</p>
          <p className="text-4xl font-bold mt-2">{stats.openIssues}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
          <p className="text-purple-200 text-sm font-medium">In Progress</p>
          <p className="text-4xl font-bold mt-2">{stats.inProgressIssues}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-6 text-white">
          <p className="text-green-200 text-sm font-medium">Resolved</p>
          <p className="text-4xl font-bold mt-2">{stats.resolvedIssues}</p>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Issues</h2>
          <Link href="/projects" className="text-sm text-blue-400 hover:text-blue-300">
            View all →
          </Link>
        </div>

        {recentIssues.length > 0 ? (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 border border-[#1f1f23] rounded-lg hover:border-blue-500/50 hover:bg-[#1a1a1d] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{issue.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      {issue.assignedTo && (
                        <span className="text-gray-500">
                          👤 {issue.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No recent issues</p>
          </div>
        )}
      </div>
    </div>
  );
}
