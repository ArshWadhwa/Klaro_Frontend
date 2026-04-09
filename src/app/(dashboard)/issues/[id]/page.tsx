'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, MessageSquare, Calendar, User } from 'lucide-react';
import { commentsApi } from '@/lib/api/comments.api';
import toast from 'react-hot-toast';
import { IssueDetails } from '@/types/issue.types';
import { Comment } from '@/types/comment.types';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = Number(params.id);
  
  const [issue, _setIssue] = useState<IssueDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, _setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    // fetchIssueDetails();
    fetchComments();
  }, [issueId]);

  // const fetchIssueDetails = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await issuesApi.getIssueById(issueId);
  //     setIssue(data);
  //   } catch (error: any) {
  //     console.error('Error fetching issue:', error);
  //     toast.error('Failed to load issue details');
  //     setTimeout(() => router.push('/issues'), 2000);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const data = await commentsApi.getCommentsByIssue(issueId);
      setComments(data);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      // Don't show error for 404, just keep empty array
      if (error?.response?.status !== 404) {
        toast.error('Failed to load comments');
      }
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);
    try {
      await commentsApi.addComment(issueId, { content: newComment });
      toast.success('Comment added!');
      setNewComment('');
      fetchComments();
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'LOW': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TO_DO': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'DONE': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUG': return '🐛';
      case 'FEATURE': return '✨';
      case 'TASK': return '📋';
      default: return '📌';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Issue not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push('/issues')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Issues
      </button>

      {/* Issue Header */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <span className="text-4xl">{getTypeIcon(issue.type)}</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}>
                {issue.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(issue.priority)}`}>
                {issue.priority}
              </span>
              <span className="px-3 py-1 bg-[#1a1a1d] text-gray-400 rounded-full text-sm font-medium border border-[#1f1f23]">
                {issue.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{issue.title}</h1>
            {issue.description && (
              <p className="text-gray-400 whitespace-pre-wrap mb-4">{issue.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#1f1f23]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Created by</p>
              <p className="font-semibold text-white">{issue.createdBy}</p>
            </div>
          </div>
          
          {issue.assignedTo && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned to</p>
                <p className="font-semibold text-white">{issue.assignedTo}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-semibold text-white">
                {new Date(issue.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-gray-400" />
          <h2 className="text-xl font-bold text-white">
            Comments ({comments.length})
          </h2>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-4 py-3 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500 mb-3"
          />
          <button
            type="submit"
            disabled={isSubmittingComment || !newComment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmittingComment ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Comment'
            )}
          </button>
        </form>

        {/* Comments List */}
        {isLoadingComments ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-[#1a1a1d] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-semibold">
                      {comment.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{comment.author}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
