'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { issuesApi } from '@/lib/api/issues.api';
import { projectsApi } from '@/lib/api/projects.api';
import { aiApi } from '@/lib/api/ai.api';
import toast from 'react-hot-toast';
import { Project } from '@/types/project.types';
import { IssuePriority, IssueStatus, IssueType } from '@/types/issue.types';

export default function CreateIssuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('projectId');

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const [formData, setFormData] = useState({
    projectId: projectIdParam || '',
    title: '',
    description: '',
    priority: 'MEDIUM' as IssuePriority,
    status: 'TO_DO' as IssueStatus,
    type: 'TASK' as IssueType,
    assigneeId: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const data = await projectsApi.getUserProjects();
      setProjects(data);
      if (projectIdParam && !formData.projectId) {
        setFormData(prev => ({ ...prev, projectId: projectIdParam }));
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.description.trim()) {
      toast.error('Please enter a description first');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const result = await aiApi.generateContent(formData.description);
      setAiSuggestion(result.aiSuggestion);
      toast.success('AI recommendation generated!');
    } catch (error: any) {
      console.error('Error generating AI content:', error);
      toast.error('Failed to generate AI recommendation');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSubmitting(true);
    try {
      await issuesApi.createIssue({
        projectId: Number(formData.projectId),
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        status: formData.status,
        type: formData.type,
        assigneeId: formData.assigneeId ? Number(formData.assigneeId) : undefined,
      });

      toast.success('Issue created successfully!');
      router.push(`/projects/${formData.projectId}`);
    } catch (error: any) {
      console.error('Error creating issue:', error);
      toast.error(error?.response?.data?.message || error?.response?.data?.error || 'Failed to create issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Issue</h1>
        <p className="text-gray-400 mt-2">Track bugs, features, and tasks for your project</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form Card */}
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6 space-y-6">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project <span className="text-red-500">*</span>
            </label>
            {isLoadingProjects ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading projects...
              </div>
            ) : (
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} {project.groupName ? `(${project.groupName})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['BUG', 'FEATURE', 'TASK'] as IssueType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.type === type
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-[#1f1f23] hover:border-[#2a2a2e] text-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {type === 'BUG' ? '🐛' : type === 'FEATURE' ? '✨' : '📋'}
                  </div>
                  <div className="font-medium">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
              className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI || !formData.description.trim()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get AI Recommendation
                  </>
                )}
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the issue..."
              rows={6}
              className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500"
            />
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold text-purple-300">AI Recommendation</h3>
              </div>
              <div className="text-sm text-purple-200 whitespace-pre-wrap">{aiSuggestion}</div>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['LOW', 'MEDIUM', 'HIGH'] as IssuePriority[]).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    formData.priority === priority
                      ? priority === 'HIGH'
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : priority === 'MEDIUM'
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                        : 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-[#1f1f23] hover:border-[#2a2a2e] text-gray-400'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['TO_DO', 'IN_PROGRESS', 'DONE'] as IssueStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    formData.status === status
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-[#1f1f23] hover:border-[#2a2a2e] text-gray-400'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Assign to User ID (Optional)
            </label>
            <input
              type="number"
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              placeholder="Enter user ID to assign"
              className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to assign later</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Issue'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-[#1f1f23] text-gray-300 rounded-lg hover:bg-[#1a1a1d] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
