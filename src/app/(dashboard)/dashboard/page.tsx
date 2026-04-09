'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2,
  TrendingUp,
  TrendingDown,
  FolderKanban,
  Users,
  AlertCircle,
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
      const [projects, groups, myIssues] = await Promise.all([
        projectsApi.getUserProjects(),
        groupsApi.getUserGroups(),
        apiClient.get('/api/issues/issues/assigned-to/me').then(res => res.data).catch(() => []),
      ]);

      // Fetch issues only from user's own projects (not all DB issues)
      const projectIssueArrays = await Promise.all(
        projects.map((p: any) =>
          apiClient.get(`/api/issues/projects/${p.id}/issues`).then(res => res.data).catch(() => [])
        )
      );
      const allIssues = projectIssueArrays.flat();

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
      case 'HIGH': return 'bg-red-500/20 text-red-400';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400';
      case 'LOW': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
      case 'TO_DO':
        return 'bg-blue-500/20 text-blue-400';
      case 'IN_PROGRESS':
        return 'bg-purple-500/20 text-purple-400';
      case 'RESOLVED':
      case 'DONE':
      case 'CLOSED':
        return 'bg-emerald-500/20 text-emerald-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Chart data for bar chart
  const chartData = [
    { month: 'Jan', value: 5800 },
    { month: 'Feb', value: 4200 },
    { month: 'Mar', value: 3800 },
    { month: 'Apr', value: 2800 },
    { month: 'May', value: 2200 },
    { month: 'Jun', value: 1800 },
    { month: 'Jul', value: 1400 },
    { month: 'Aug', value: 1000 },
    { month: 'Sep', value: 800 },
    { month: 'Oct', value: 600 },
    { month: 'Nov', value: 400 },
    { month: 'Dec', value: 300 },
  ];

  // Traffic sources data
  const trafficSources = [
    { name: 'Direct', value: 100 },
    { name: 'Organic Search', value: 85 },
    { name: 'Referral', value: 65 },
    { name: 'Organic Social', value: 50 },
    { name: 'Organic Video', value: 35 },
  ];

  const maxChartValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-1">Overview</h2>
          <p className="text-sm text-gray-500">Visualize your main activities data</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Projects */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Projects</p>
            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold text-white">{stats.totalProjects || 0}</span>
              <div className="flex items-center gap-1 text-emerald-400 text-sm mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>32%</span>
              </div>
            </div>
          </div>

          {/* Total Issues */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Issues</p>
            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold text-white">{stats.totalIssues || 0}</span>
              <div className="flex items-center gap-1 text-red-400 text-sm mb-1">
                <TrendingDown className="h-4 w-4" />
                <span>15%</span>
              </div>
            </div>
          </div>

          {/* Total Groups */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Groups</p>
            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold text-white">{stats.totalGroups || 0}</span>
              <div className="flex items-center gap-1 text-emerald-400 text-sm mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart - Issues Overview */}
        <div className="lg:col-span-3 bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-1">Activity Overview</h3>
            <p className="text-sm text-gray-500">Visualize your main activities data</p>
          </div>

          {/* Y-axis labels and Chart */}
          <div className="flex">
            {/* Y-axis */}
            <div className="flex flex-col justify-between text-xs text-gray-500 pr-4 py-2" style={{ height: '240px' }}>
              <span>6000</span>
              <span>4500</span>
              <span>3000</span>
              <span>1500</span>
              <span>0</span>
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end gap-2" style={{ height: '240px' }}>
              {chartData.map((item, index) => {
                const heightPercent = (item.value / maxChartValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-blue-500 rounded-t-md hover:bg-blue-400 transition-colors cursor-pointer"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex ml-10 mt-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex-1 text-center text-xs text-gray-500">
                {item.month}
              </div>
            ))}
          </div>
        </div>

        {/* Issue Status Distribution */}
        <div className="lg:col-span-2 bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-1">Issue Status</h3>
            <p className="text-sm text-gray-500">Distribution by status</p>
          </div>

          {/* Status Bars */}
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index}>
                <div className="h-10 relative rounded-lg overflow-hidden bg-[#1a1a1d]">
                  <div 
                    className="h-full bg-blue-500 rounded-lg flex items-center px-4 transition-all"
                    style={{ width: `${source.value}%` }}
                  >
                    <span className="text-sm font-medium text-white">{source.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer text */}
          <div className="mt-6 space-y-2 text-xs text-gray-500">
            <p>• Track your issue resolution progress</p>
            <p>• Monitor team productivity metrics</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/projects" className="bg-[#131316] border border-[#1f1f23] rounded-xl p-5 hover:border-blue-500/50 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FolderKanban className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-sm text-gray-500">Total Projects</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
        </Link>

        <div className="bg-[#131316] border border-[#1f1f23] rounded-xl p-5 hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-sm text-gray-500">Open Issues</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.openIssues}</p>
        </div>

        <div className="bg-[#131316] border border-[#1f1f23] rounded-xl p-5 hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.inProgressIssues}</p>
        </div>

        <Link href="/groups" className="bg-[#131316] border border-[#1f1f23] rounded-xl p-5 hover:border-emerald-500/50 transition-colors group">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-sm text-gray-500">Total Groups</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalGroups}</p>
        </Link>
      </div>

      {/* Recent Issues */}
      {recentIssues.length > 0 && (
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Recent Issues</h3>
              <p className="text-sm text-gray-500">Latest issues across your projects</p>
            </div>
         
          </div>

          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 bg-[#1a1a1d] hover:bg-[#1f1f23] border border-[#1f1f23] rounded-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-2">{issue.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      {issue.assignedTo && (
                        <span className="text-gray-500 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {issue.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
