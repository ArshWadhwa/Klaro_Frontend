'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Search, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { groupsApi } from '@/lib/api/groups.api';
import { useAuthStore } from '@/lib/stores/authStore';
import CreateGroupDialog from '@/components/groups/CreateGroupDialog';
import JoinGroupDialog from '@/components/groups/JoinGroupDialog';
import toast from 'react-hot-toast';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const isAdmin = useAuthStore(state => state.isAdmin());

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const data = await groupsApi.getUserGroups();
      console.log('✅ Loaded', data.length, 'groups');
      setGroups(data);
    } catch (error: any) {
      console.error('❌ Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchGroups();
      return;
    }

    setIsLoading(true);
    try {
      const data = await groupsApi.searchGroups(searchQuery);
      setGroups(data);
    } catch (error) {
      console.error('Error searching groups:', error);
      toast.error('Failed to search groups');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGroups = searchQuery
    ? groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : groups;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Groups</h1>
          <p className="text-gray-500 mt-1">Manage your collaborative groups and teams</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsJoinDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[#1f1f23] text-gray-300 rounded-lg hover:bg-[#1a1a1d] hover:border-[#2a2a2e] transition-colors"
          >
            <LogIn className="h-5 w-5" />
            Join Group
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Group
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#131316] border border-[#1f1f23] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredGroups.length === 0 && (
        <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-12 text-center">
          <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No groups found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first group'}
          </p>
          {isAdmin && !searchQuery && (
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Group
            </button>
          )}
        </div>
      )}

      {/* Groups Grid */}
      {!isLoading && filteredGroups.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
          <div key={group.id} className="bg-[#131316] border border-[#1f1f23] rounded-xl p-6 hover:border-[#2a2a2e] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">{group.name || 'Unnamed Group'}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{group.description || 'No description'}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>👥 {group.memberCount ?? 0} members</span>
              <span>📁 {group.projectCount ?? 0} projects</span>
            </div>
            
            <Link
              href={`/groups/${group.id}`}
              className="block w-full text-center py-2 border border-[#1f1f23] rounded-lg text-gray-300 hover:bg-[#1a1a1d] hover:border-[#2a2a2e] transition-colors"
            >
              View Details
            </Link>
          </div>
          ))}
        </div>
      )}

      {/* Create Group Dialog */}
      <CreateGroupDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={fetchGroups}
      />

      {/* Join Group Dialog */}
      <JoinGroupDialog
        isOpen={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
        onSuccess={fetchGroups}
      />
    </div>
  );
}
