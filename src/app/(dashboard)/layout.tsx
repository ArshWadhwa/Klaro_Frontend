'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BarChart3,
  FileText,
  Crown,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { useSidebarStore } from '@/lib/stores/sidebarStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isAdmin, fetchCurrentUser } =
    useAuthStore();
  const { isCollapsed } = useSidebarStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && !isAuthenticated) {
        try {
          await fetchCurrentUser();
        } catch (error) {
          console.error('Auth check failed:', error);
          router.push('/login');
        }
      } else if (!isAuthenticated && !accessToken) {
        router.push('/login');
      }
      setIsChecking(false);
    };
    checkAuth();
  }, [isAuthenticated, router, fetchCurrentUser]);



  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };



  const navItems = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/groups', label: 'Groups', icon: Users, hasDropdown: true },
    { href: '/projects', label: 'Projects', icon: FolderKanban, hasDropdown: true },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  // if (isAdmin()) {
  //   navItems.push({ href: '/admin', label: 'Admin', icon: Crown });
  // }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-[#0d0d0f]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#131316] border-r border-[#1f1f23] transition-transform duration-200 z-40 flex flex-col ${isCollapsed
            ? '-translate-x-full'
            : sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo + Org */}
        <div className="p-4 border-b border-[#1f1f23]">
          <Link href="/dashboard" className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Klaro
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1a1a1d] border border-[#2a2a2e] rounded-lg">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none flex-1"
            />
            <span className="text-xs text-gray-600 bg-[#232326] px-1.5 py-0.5 rounded">/</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${active
                    ? 'bg-[#1a1a1d] text-white'
                    : 'text-gray-400 hover:bg-[#1a1a1d] hover:text-gray-200'
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {'hasDropdown' in item && item.hasDropdown && (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`${isCollapsed ? '' : 'lg:pl-64'} min-h-screen transition-all duration-200`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-[#1f1f23]">
          <div className="flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-[#1a1a1d] rounded-lg text-gray-400"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="text-lg font-semibold text-white">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2">


              {/* User Avatar + Logout */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-white font-medium leading-none">{user?.fullName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-[#1a1a1d] rounded-lg text-gray-400 hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1d',
            color: '#fff',
            border: '1px solid #2a2a2e',
          },
        }}
      />
    </div>
  );
}
