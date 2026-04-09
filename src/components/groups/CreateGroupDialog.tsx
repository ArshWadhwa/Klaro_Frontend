'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Copy, Check, Users, Sparkles } from 'lucide-react';
import { groupsApi } from '@/lib/api/groups.api';
import toast from 'react-hot-toast';

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGroupDialog({ isOpen, onClose, onSuccess }: CreateGroupDialogProps) {
  const [step, setStep] = useState<'create' | 'success'>('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('create');
      setFormData({ name: '', description: '' });
      setCreatedGroup(null);
      setCopied(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsLoading(true);

    try {
      const group = await groupsApi.createGroup({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        memberEmails: [], // Empty - members will join via invite code
      });

      console.log('✅ Group created:', group);
      setCreatedGroup(group);
      setStep('success');
      toast.success('Group created successfully!');
      onSuccess(); // Refresh groups list in parent
    } catch (error: any) {
      console.error('❌ Error creating group:', error);
      toast.error(error?.response?.data?.message || 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (createdGroup?.inviteCode) {
      navigator.clipboard.writeText(createdGroup.inviteCode);
      setCopied(true);
      toast.success('Invite code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDone = () => {
    onClose();
    setStep('create');
    setFormData({ name: '', description: '' });
    setCreatedGroup(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#131316] border-b border-[#1f1f23] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {step === 'create' ? 'Create New Group' : 'Group Created! 🎉'}
          </h2>
          <button
            onClick={handleDone}
            className="p-2 hover:bg-[#1f1f23] rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {step === 'create' ? (
          /* Step 1: Create Group Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#0d0d0f] border border-[#1f1f23] text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500"
                placeholder="e.g. Frontend Team, Project Alpha"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-gray-500">(optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#0d0d0f] border border-[#1f1f23] text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-500 resize-none"
                placeholder="What's this group about?"
                rows={3}
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-300">How members join?</p>
                  <p className="text-xs text-gray-400 mt-1">
                    After creating the group, you'll get a unique <strong className="text-white">invite code</strong>. 
                    Share it with your team and they can join instantly — no need to add each member manually.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    Create Group
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDone}
                className="px-4 py-3 border border-[#1f1f23] text-gray-300 rounded-xl hover:bg-[#1f1f23] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Success - Show Invite Code */
          <div className="p-6 space-y-6">
            {/* Success Icon */}
            <div className="text-center">
              <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                &quot;{createdGroup?.name}&quot; is ready!
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                Share this invite code with your team members
              </p>
            </div>

            {/* Invite Code Card */}
            <div className="bg-[#0d0d0f] border border-[#1f1f23] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Invite Code</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#131316] border-2 border-dashed border-[#2a2a2f] rounded-xl px-5 py-4 text-center">
                  <span className="text-2xl font-mono font-bold text-white tracking-[0.3em]">
                    {createdGroup?.inviteCode || 'N/A'}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`p-4 rounded-xl transition-all ${
                    copied 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-[#1f1f23] text-gray-400 hover:text-white hover:bg-[#2a2a2f]'
                  }`}
                >
                  {copied ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* How it works */}
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">How members join</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="h-6 w-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span className="text-gray-300">Share the invite code with your team</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="h-6 w-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span className="text-gray-300">They click <strong className="text-white">"Join Group"</strong> on the Groups page</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="h-6 w-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span className="text-gray-300">Paste the code and they&apos;re in! 🚀</span>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={handleDone}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
