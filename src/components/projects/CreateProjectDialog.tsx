'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { projectsApi } from '@/lib/api/projects.api';
import { groupsApi } from '@/lib/api/groups.api';
import toast from 'react-hot-toast';
import { Group } from '@/types/group.types';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultGroupId?: number;
}

export default function CreateProjectDialog({ isOpen, onClose, onSuccess, defaultGroupId }: CreateProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    groupId: defaultGroupId ? String(defaultGroupId) : '',
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
      if (defaultGroupId) {
        setFormData(prev => ({ ...prev, groupId: String(defaultGroupId) }));
      }
    }
  }, [isOpen, defaultGroupId]);

  const fetchGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const data = await groupsApi.getUserGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await projectsApi.createProject({
        name: formData.name,
        description: formData.description || undefined,
        groupId: formData.groupId ? Number(formData.groupId) : undefined,
      });

      toast.success('Project created successfully!');
      onSuccess();
      onClose();
      setFormData({ name: '', description: '', groupId: '' });
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error?.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#131316] border border-[#1f1f23] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f1f23]">
          <h2 className="text-2xl font-bold text-white">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500"
              placeholder="e.g., E-commerce Platform"
              disabled={isLoading}
              maxLength={255}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500"
              placeholder="Describe the project goals and scope..."
              disabled={isLoading}
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Group Selection */}
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-300 mb-2">
              Assign to Group (Optional)
            </label>
            {isLoadingGroups ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading groups...
              </div>
            ) : (
              <select
                id="group"
                value={formData.groupId}
                onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="">No Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            )}
            {groups.length === 0 && !isLoadingGroups && (
              <p className="text-sm text-gray-500 mt-1">
                No groups available. Create a group first to assign this project.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#1f1f23] rounded-lg text-gray-300 hover:bg-[#1a1a1d] transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
