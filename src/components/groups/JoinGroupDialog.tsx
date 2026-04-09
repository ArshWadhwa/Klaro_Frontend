'use client';

import { useState } from 'react';
import { X, Loader2, LogIn } from 'lucide-react';
import { groupsApi } from '@/lib/api/groups.api';
import toast from 'react-hot-toast';

interface JoinGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JoinGroupDialog({ isOpen, onClose, onSuccess }: JoinGroupDialogProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔑 Attempting to join group with code:', inviteCode.trim());
      const group = await groupsApi.joinByInviteCode(inviteCode.trim());
      console.log('✅ Successfully joined group:', group);
      toast.success(`Successfully joined "${group.name}"!`);
      setInviteCode('');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ Error joining group:', error);
      console.error('Response status:', error?.response?.status);
      console.error('Response data:', error?.response?.data);
      console.error('Response headers:', error?.response?.headers);
      console.error('Request URL:', error?.config?.url);
      console.error('Request Method:', error?.config?.method);
      console.error('Request headers:', error?.config?.headers);
      console.error('Request data:', error?.config?.data);
      
      // Log token info for debugging
      const token = localStorage.getItem('accessToken');
      console.log('🔐 Token exists:', !!token);
      if (token) {
        console.log('🔐 Token length:', token.length);
        console.log('🔐 Token preview:', token.substring(0, 50) + '...');
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('🔐 Token payload:', payload);
            console.log('🔐 Token expiry:', new Date(payload.exp * 1000));
            console.log('🔐 Token expired?:', Date.now() >= payload.exp * 1000);
          }
        } catch (e) {
          console.error('🔐 Failed to parse token:', e);
        }
      }
      
      let errorMessage = 'Failed to join group';
      
      if (error?.response?.status === 403) {
        errorMessage = 'Access denied. Please make sure you are logged in.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Invalid invite code. Please check and try again.';
      } else if (error?.response?.data?.message) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#131316] border border-[#1f1f23] rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-[#1f1f23]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Join Group</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter invite code (e.g., ABC123XYZ)"
              className="w-full px-3 py-2 bg-[#1a1a1d] border border-[#1f1f23] text-white rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent uppercase placeholder:text-gray-500"
              disabled={isLoading}
              maxLength={12}
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter the invite code provided by your group admin
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#1f1f23] text-gray-300 rounded-lg hover:bg-[#1a1a1d] transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading || !inviteCode.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Join Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
