'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/stores/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });

      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid authentication response from server');
      }

      // 1. Save tokens from /auth/signin
      setTokens(accessToken, refreshToken);

      // 2. Fetch and save user from /auth/user
      const user = await authApi.getCurrentUser();
      setUser(user);

      // 3. Navigate successfully
      toast.success(`Welcome back, ${user.fullName?.split(' ')[0] || 'there'}!`);
      router.push('/dashboard');
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col lg:flex-row text-zinc-100">
      {/* Left Side: Preview Showcase with Smooth Slide Animation (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-10 xl:p-14 border-r border-zinc-800/80 bg-[#0c0c0e] relative overflow-hidden">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="text-5xl font-semibold tracking-tight text-white">
              Klaro
            </span>
          </Link>
        </motion.div>

        {/* Content & Animated Dashboard Image */}
        <div className="my-auto py-8 max-w-xl">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl xl:text-3xl font-semibold text-zinc-100 tracking-tight leading-snug"
          >
            Plan, track, and collaborate on your projects in one workspace.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-sm mt-3 leading-relaxed"
          >
            Manage issues with Kanban boards, chat on team documents, and keep your entire development workflow organized.
          </motion.p>

          {/* Smooth Slide & Float Dashboard Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: 'easeOut' } }}
            className="mt-8 rounded-xl border border-zinc-800 bg-[#141417] overflow-hidden shadow-2xl relative group cursor-pointer"
          >
            <img
              src="/dashboard-preview.png"
              alt="Klaro Dashboard Preview"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.015]"
            />
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Klaro. All rights reserved.
        </div>
      </div>

      {/* Right Side: Simple Clean Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col justify-between p-6 sm:p-10 md:p-12 bg-[#09090b]">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2">
            <span className="text-xl font-bold text-white">Klaro</span>
          </Link>

          <Link
            href="/"
            className="ml-auto text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-sm mx-auto my-auto py-8"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Sign In
            </h1>
            <p className="text-zinc-400 text-sm mt-1.5">
              Enter your credentials to access your account.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-950/30 border border-red-900/40 rounded-lg flex items-start gap-2.5 text-red-300 text-xs animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1 leading-snug">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#121214] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button in Blue */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center text-xs text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </motion.div>

        {/* Bottom copyright on mobile */}
        <div className="lg:hidden text-center text-xs text-zinc-600 pt-4">
          © {new Date().getFullYear()} Klaro
        </div>
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}
