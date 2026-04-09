'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Users, Shield, Activity, Settings, Trash2, UserCheck, UserX } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuthStore();

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, router]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage users and system settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131316] border border-[#1f1f23] p-6 rounded-xl hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">156</h3>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-[#131316] border border-[#1f1f23] p-6 rounded-xl hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">142</h3>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </div>

        <div className="bg-[#131316] border border-[#1f1f23] p-6 rounded-xl hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">12</h3>
              <p className="text-sm text-gray-500">Admins</p>
            </div>
          </div>
        </div>

        <div className="bg-[#131316] border border-[#1f1f23] p-6 rounded-xl hover:border-[#2a2a2e] transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">1,234</h3>
              <p className="text-sm text-gray-500">Today's Activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-[#131316] border border-[#1f1f23] rounded-2xl">
        <div className="p-6 border-b border-[#1f1f23]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">User Management</h2>
            <div className="flex items-center gap-3">
              <input
                type="search"
                placeholder="Search users..."
                className="px-4 py-2 bg-[#1a1a1d] border border-[#1f1f23] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add User
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1f1f23] bg-[#1a1a1d]">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">User</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Role</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Joined</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'John Doe',
                  email: 'john.doe@example.com',
                   role: 'ROLE_ADMIN',
                   status: 'Active',
                   joined: '2024-01-15',
                 },
                 {
                   name: 'Jane Smith',
                   email: 'jane.smith@example.com',
                   role: 'ROLE_USER',
                   status: 'Active',
                   joined: '2024-02-20',
                 },
                 {
                   name: 'Bob Johnson',
                   email: 'bob.johnson@example.com',
                   role: 'ROLE_USER',
                   status: 'Inactive',
                   joined: '2024-03-10',
                 },
                 {
                   name: 'Alice Williams',
                   email: 'alice.williams@example.com',
                   role: 'ROLE_USER',
                   status: 'Active',
                   joined: '2024-03-25',
                 },
              ].map((userData, index) => (
                <tr key={index} className="border-b border-[#1f1f23] hover:bg-[#1a1a1d]">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-white">{userData.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{userData.email}</td>
                  <td className="py-4 px-6">
                     <span
                       className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                         userData.role === 'ROLE_ADMIN'
                           ? 'bg-purple-500/20 text-purple-400'
                           : 'bg-gray-500/20 text-gray-400'
                       }`}
                     >
                       {userData.role === 'ROLE_ADMIN' && <Shield className="h-3 w-3" />}
                       {userData.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                     </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        userData.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {userData.status === 'Active' ? (
                        <UserCheck className="h-3 w-3" />
                      ) : (
                        <UserX className="h-3 w-3" />
                      )}
                      {userData.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{userData.joined}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-[#1f1f23]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 1 to 4 of 156 users</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-[#1f1f23] rounded-lg text-gray-400 hover:bg-[#1a1a1d] disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
