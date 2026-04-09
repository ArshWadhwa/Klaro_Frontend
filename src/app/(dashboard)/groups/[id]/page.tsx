'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, FolderKanban, Plus, ArrowLeft, Loader2, Mail, Calendar, Crown, Copy, RefreshCw, Share2, Trash2, UserMinus } from 'lucide-react';
import Link from 'next/link';
import { groupsApi } from '@/lib/api/groups.api';
import { projectsApi } from '@/lib/api/projects.api';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/stores/authStore';
import CreateProjectDialog from '@/components/projects/CreateProjectDialog';
import toast from 'react-hot-toast';
import { GroupDetails } from '@/types/group.types';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Number(params.id);
  const isAdmin = useAuthStore(state => state.isAdmin());
  const currentUserEmail = useAuthStore(state => state.user?.email);
  
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [isRegeneratingCode, setIsRegeneratingCode] = useState(false);

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupProjects();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const data = await groupsApi.getGroupById(groupId);
      console.log('✅ Group loaded:', data.name, '- Members:', data.memberCount);
      setGroup(data);
      setInviteCode(data.inviteCode || '');
      
      // ✅ Fetch members using native query endpoint
      await fetchMembersDetails();
    } catch (error: any) {
      console.error('❌ Error fetching group:', error);
      toast.error('Failed to load group details');
      setTimeout(() => router.push('/groups'), 2000);
    }
  };

  const fetchMembersDetails = async () => {
    try {
      // ✅ Step 1: Get member emails from native query endpoint
      const memberEmails = await groupsApi.getGroupMemberEmails(groupId);
      console.log('📧 Member emails from backend:', memberEmails);
      console.log('📧 Count:', memberEmails.length);
      
      if (!memberEmails || memberEmails.length === 0) {
        console.warn('⚠️ No member emails returned from backend!');
        setMembers([]);
        return;
      }
      
      // ✅ Step 2: Fetch all users (public endpoint)
      const allUsers = await authApi.getAvailableUsers();
      console.log('👥 All users fetched:', allUsers.length);
      console.log('👥 First user:', allUsers[0]);
      
      // ✅ Step 3: Filter users by emails
      const lowerMemberEmails = memberEmails.map(e => e.toLowerCase());
      console.log('🔍 Looking for emails:', lowerMemberEmails);
      
      const filteredMembers = allUsers.filter(user => {
        const userEmail = user.email.toLowerCase();
        const isMatch = lowerMemberEmails.includes(userEmail);
        if (isMatch) {
          console.log('✅ Match found:', user.email);
        }
        return isMatch;
      });
      
      console.log('✅ Filtered members:', filteredMembers.length);
      console.log('✅ Members:', filteredMembers);
      setMembers(filteredMembers);
    } catch (error: any) {
      console.error('❌ Error fetching members:', error);
      console.error('❌ Error details:', error?.response?.data);
      console.error('❌ Status:', error?.response?.status);
      setMembers([]);
    }
  };

  const fetchGroupProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectsApi.getProjectsByGroup(groupId);
      setProjects(data);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      console.error('Error details:', error?.response?.data);
      // Don't show error toast if it's just empty
      if (error?.response?.status !== 404) {
        toast.error('Failed to load projects');
      } else {
        setProjects([]); // Empty array for 404
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied to clipboard!');
  };

  const handleRegenerateCode = async () => {
    if (!confirm('Are you sure you want to regenerate the invite code? The old code will no longer work.')) {
      return;
    }

    setIsRegeneratingCode(true);
    try {
      const response = await groupsApi.regenerateInviteCode(groupId);
      setInviteCode(response.inviteCode);
      toast.success('Invite code regenerated successfully!');
    } catch (error: any) {
      console.error('Error regenerating invite code:', error);
      toast.error(error?.response?.data?.message || 'Failed to regenerate invite code');
    } finally {
      setIsRegeneratingCode(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm(`Are you sure you want to delete "${group?.name}"? This cannot be undone.`)) return;
    try {
      await groupsApi.deleteGroup(groupId);
      toast.success('Group deleted successfully');
      router.push('/groups');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete group');
    }
  };

  const handleRemoveMember = async (memberEmail: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from this group?`)) return;
    try {
      await groupsApi.removeMember(groupId, memberEmail);
      toast.success(`${memberName} removed from group`);
      await fetchMembersDetails();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? All issues and documents in this project will be lost.`)) return;
    try {
      await projectsApi.deleteProject(projectId);
      toast.success(`Project "${projectName}" deleted`);
      fetchGroupProjects();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete project');
    }
  };

  const isOwnerOrAdmin = group && (group.ownerEmail === currentUserEmail || isAdmin);

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/groups')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Groups
      </button>

      {/* Group Header */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{group.name}</h1>
              <p className="text-gray-400 mt-2">{group.description}</p>
            </div>
          </div>
          {isOwnerOrAdmin && (
            <button
              onClick={handleDeleteGroup}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete Group
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#1f1f23]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Members</p>
              <p className="font-semibold text-white">{members.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <FolderKanban className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Projects</p>
              <p className="font-semibold text-white">{projects.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-semibold text-white">
                {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Code Section - Only visible to Owner or Admin */}
      {isOwnerOrAdmin && inviteCode && (
        <div className="bg-[#131316] border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Invite Code</h2>
            </div>
          </div>
          
          <p className="text-gray-400 mb-4">
            Share this code with others to invite them to join this group
          </p>

          <div className="flex gap-3">
            <div className="flex-1 bg-[#1a1a1d] rounded-lg border border-[#1f1f23] p-4">
              <p className="text-xs text-gray-500 mb-1">Invite Code</p>
              <p className="text-2xl font-mono font-bold text-blue-400 tracking-wider">
                {inviteCode}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopyInviteCode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Copy invite code"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              
              <button
                onClick={handleRegenerateCode}
                disabled={isRegeneratingCode}
                className="flex items-center gap-2 px-4 py-2 border border-[#1f1f23] text-gray-300 rounded-lg hover:bg-[#1a1a1d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate new code"
              >
                {isRegeneratingCode ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-400">
              💡 <strong>Tip:</strong> Users can join this group by clicking "Join Group" on the Groups page and entering this code.
            </p>
          </div>
        </div>
      )}

      {/* Members Section */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Members ({members.length})</h2>
        </div>
        <div className="space-y-3">
          {members.length > 0 ? (
            members.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 p-3 hover:bg-[#1a1a1d] rounded-lg transition-colors">
                <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 font-semibold">
                    {member.fullName?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{member.fullName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </p>
                </div>
                {group.ownerEmail === member.email ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded">
                    <Crown className="h-3 w-3" />
                    Owner
                  </span>
                ) : isOwnerOrAdmin && (
                  <button
                    onClick={() => handleRemoveMember(member.email, member.fullName)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title={`Remove ${member.fullName}`}
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No members yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Members will appear here once they are added to the group
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Projects</h2>
          {isAdmin && (
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Project
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-2 p-4 border border-[#1f1f23] rounded-lg hover:border-[#2a2a2e] hover:bg-[#1a1a1d] transition-all">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-start gap-4 flex-1"
                >
                  <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>👤 {project.createdBy}</span>
                      <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
                {isOwnerOrAdmin && (
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    title={`Delete ${project.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderKanban className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first project</p>
            {isAdmin && (
              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Dialog - Pre-filled with this group */}
      <CreateProjectDialog
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSuccess={fetchGroupProjects}
        defaultGroupId={groupId}
      />
    </div>
  );
}
