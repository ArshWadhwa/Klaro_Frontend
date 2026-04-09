'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FolderKanban, Plus, ArrowLeft, Loader2, Calendar, Users, Target, FileText, Download, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { projectsApi } from '@/lib/api/projects.api';
import { issuesApi } from '@/lib/api/issues.api';
import { documentsApi } from '@/lib/api/documents.api';
import toast from 'react-hot-toast';
import { Project } from '@/types/project.types';
import { Issue } from '@/types/issue.types';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from '@/components/ui/kanban';
import { apiClient } from '@/lib/api/client';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState<Record<string, Issue[]>>({
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectIssues();
    fetchProjectDocuments();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const projects = await projectsApi.getUserProjects();
      const foundProject = projects.find(p => p.id === projectId);
      
      if (foundProject) {
        setProject(foundProject);
      } else {
        throw new Error('Project not found');
      }
    } catch (error: any) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project details');
      setTimeout(() => router.push('/projects'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectIssues = async () => {
    setIsLoadingIssues(true);
    try {
      const data = await issuesApi.getIssuesByProject(projectId);
      
      const grouped: Record<string, Issue[]> = {
        TO_DO: data.filter(i => i.status === 'TO_DO' || i.status === 'OPEN'),
        IN_PROGRESS: data.filter(i => i.status === 'IN_PROGRESS'),
        DONE: data.filter(i => i.status === 'DONE' || i.status === 'RESOLVED' || i.status === 'CLOSED'),
      };
      
      setColumns(grouped);
    } catch (error: any) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to load issues');
    } finally {
      setIsLoadingIssues(false);
    }
  };

  const fetchProjectDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      const data = await documentsApi.getProjectDocuments(projectId);
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      // Only show error toast if it's not a "no documents" scenario
      if (error?.response?.status !== 404 && error?.response?.status !== 204) {
        toast.error('Failed to load documents');
      }
      setDocuments([]);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleDeleteIssue = async (issueId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this issue?')) return;
    
    try {
      await issuesApi.deleteIssue(issueId);
      toast.success('Issue deleted');
      fetchProjectIssues();
    } catch (error: any) {
      console.error('Error deleting issue:', error);
      const msg = typeof error?.response?.data === 'string' 
        ? error.response.data 
        : 'Failed to delete issue';
      toast.error(msg);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await documentsApi.deleteDocument(documentId);
      toast.success('Document deleted successfully');
      fetchProjectDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDownloadDocument = async (documentId: number, fileName: string) => {
    try {
      const blob = await documentsApi.downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Document downloaded');
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleIssueMove = async (event: any) => {
    const { activeContainer, overContainer, overIndex } = event;
    
    if (activeContainer === overContainer) return;

    const activeIssues = columns[activeContainer];
    const overIssues = columns[overContainer];
    
    const activeIndex = activeIssues.findIndex(
      (item) => item.id.toString() === event.event.active.id
    );
    
    const movedIssue = activeIssues[activeIndex];
    
    // Update UI optimistically
    const newColumns = {
      ...columns,
      [activeContainer]: activeIssues.filter((_, i) => i !== activeIndex),
      [overContainer]: [
        ...overIssues.slice(0, overIndex),
        movedIssue,
        ...overIssues.slice(overIndex),
      ],
    };
    
    setColumns(newColumns);

    try {
      // The backend expects exactly this format based on UpdateIssueStatusRequest
      await apiClient.patch(`/api/issues/${movedIssue.id}/status`, {
        status: overContainer
      });
      
      toast.success('Issue moved to ' + (overContainer === 'TO_DO' ? 'To Do' : overContainer === 'IN_PROGRESS' ? 'In Progress' : 'Done'));
      
      // Refresh to get updated data from backend
      await fetchProjectIssues();
    } catch (error: any) {
      console.error('Error updating issue:', error);
      console.error('Error response:', error?.response);
      
      const errorMessage = typeof error?.response?.data === 'string' 
        ? error.response.data 
        : error?.response?.data?.message || 'Failed to update issue status';
      
      toast.error(errorMessage);
      
      // Revert the change on error
      fetchProjectIssues();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BUG': return '🐛';
      case 'FEATURE': return '✨';
      case 'TASK': return '📋';
      default: return '📌';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-12 text-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  const totalIssues = Object.values(columns).flat().length;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/projects')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-16 w-16 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <FolderKanban className="h-8 w-8 text-blue-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            {project.description && (
              <p className="text-gray-400 mt-2">{project.description}</p>
            )}
            {project.groupName && (
              <p className="text-sm text-gray-500 mt-2">
                Group: <span className="font-medium text-gray-300">{project.groupName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#1f1f23]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Created by</p>
              <p className="font-semibold text-white">{project.createdBy}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Issues</p>
              <p className="font-semibold text-white">{totalIssues}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-semibold text-white">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Issues Board</h2>
          <Link
            href={`/issues/create?projectId=${projectId}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Issue
          </Link>
        </div>

        {isLoadingIssues ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : totalIssues > 0 ? (
          <Kanban
            value={columns}
            onValueChange={setColumns}
            getItemValue={(item) => item.id.toString()}
            onMove={handleIssueMove}
          >
            <KanbanBoard className="grid grid-cols-3 gap-4">
              {Object.entries(columns).map(([status, issues]) => (
                <KanbanColumn key={status} value={status} className="rounded-lg border border-[#1f1f23] bg-[#1a1a1d] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">
                        {status === 'TO_DO' ? '📝 To Do' : status === 'IN_PROGRESS' ? '⚡ In Progress' : '✅ Done'}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#131316] text-gray-400">
                        {issues.length}
                      </span>
                    </div>
                  </div>
                  <KanbanColumnContent value={status} className="space-y-2 min-h-[400px]">
                    {issues.map((issue) => (
                      <KanbanItem key={issue.id} value={issue.id.toString()}>
                        <KanbanItemHandle cursor>
                          <div className="block p-3 bg-[#131316] rounded-lg border border-[#1f1f23] hover:border-[#2a2a2e] transition-all cursor-grab active:cursor-grabbing">
                            <div className="flex items-start gap-2 mb-2">
                              <span className="text-lg">{getTypeIcon(issue.type)}</span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-2 text-white">
                                  {issue.title}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 border ${getPriorityColor(issue.priority)}`}>
                                {issue.priority}
                              </span>
                            </div>
                            {issue.description && (
                              <p className="text-xs text-gray-500 line-clamp-2 mb-2 ml-7">{issue.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2 ml-7">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{issue.createdBy}</span>
                                {issue.assignedTo && <span>👤 {issue.assignedTo}</span>}
                              </div>
                              <button
                                onClick={(e) => handleDeleteIssue(issue.id, e)}
                                className="p-1 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                title="Delete issue"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </KanbanItemHandle>
                      </KanbanItem>
                    ))}
                  </KanbanColumnContent>
                </KanbanColumn>
              ))}
            </KanbanBoard>
            <KanbanOverlay>
              <div className="rounded-lg bg-blue-500/20 h-full w-full border-2 border-blue-500/50 border-dashed" />
            </KanbanOverlay>
          </Kanban>
        ) : (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No issues yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first issue</p>
            <Link
              href={`/issues/create?projectId=${projectId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Issue
            </Link>
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Project Documents</h2>
          <button
            onClick={() => setIsUploadDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Upload Document
          </button>
        </div>

        {isLoadingDocuments ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#1a1a1d] border border-[#1f1f23] rounded-lg p-4 hover:border-[#2a2a2e] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{doc.fileName}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleDownloadDocument(doc.id, doc.fileName)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#131316] border border-[#1f1f23] text-gray-300 rounded-lg hover:bg-[#1a1a1d] hover:border-blue-500/50 transition-all text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <Link
                    href={`/documents/${doc.id}/chat`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Chat
                  </Link>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="px-3 py-2 bg-[#131316] border border-[#1f1f23] text-red-400 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-4">Upload documents to get started</p>
            <button
              onClick={() => setIsUploadDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Upload Document
            </button>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <UploadDocumentDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onSuccess={fetchProjectDocuments}
        projectId={projectId}
      />
    </div>
  );
}
