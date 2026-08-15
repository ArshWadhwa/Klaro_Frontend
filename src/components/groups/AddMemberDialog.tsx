'use client';

import { useState } from 'react';
import { X, Loader2, UserPlus } from 'lucide-react';
import { groupsApi } from '@/lib/api/groups.api';
import toast from 'react-hot-toast';

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  onSuccess: () => void;
}

export default function AddMemberDialog({ isOpen, onClose, groupId, onSuccess }: AddMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter a user email address');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`➕ Adding member ${email.trim()} to group ${groupId}`);
      await groupsApi.addMember(groupId, email.trim());
      toast.success(`Successfully added ${email.trim()} to the group!`);
      setEmail('');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ Error adding member:', error);
      
      let errorMessage = 'Failed to add member to group';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-[#1f1f23] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Add Group Member</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1.5 hover:bg-white/5 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-500 text-sm transition-all"
              disabled={isLoading}
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter the exact email address of the user you want to add to this group.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#1f1f23] text-gray-300 rounded-xl hover:bg-[#1a1a1d] transition-colors text-sm font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium shadow-lg shadow-blue-600/25"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
