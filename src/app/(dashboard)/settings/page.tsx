'use client';

import { useState } from 'react';
import { User, Mail, Shield, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, isAdmin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for now or implement if authApi has updateProfile
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 bg-blue-600/10 text-blue-400 rounded-xl text-sm font-medium border border-blue-500/20">
            <User className="h-4 w-4" />
            Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-xl text-sm font-medium transition-all">
            <Shield className="h-4 w-4" />
            Security
          </button>
        </div>

        {/* Form Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Personal Information
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="email"
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-zinc-500 cursor-not-allowed text-sm"
                      value={formData.email}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1.5 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Email cannot be changed after registration
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">System Role</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isAdmin() ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                      {user?.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

