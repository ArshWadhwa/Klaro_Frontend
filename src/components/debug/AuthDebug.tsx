'use client';

import { useAuthStore } from '@/lib/stores/authStore';
import { useEffect, useState } from 'react';

export default function AuthDebug() {
  const { user, accessToken, isAuthenticated, isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <p>✓ Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>✓ User: {user?.fullName || 'None'}</p>
        <p>✓ Email: {user?.email || 'None'}</p>
        <p>✓ Role: {user?.role || 'None'}</p>
        <p>✓ Is Admin: {isAdmin() ? 'Yes' : 'No'}</p>
        <p>✓ Token: {accessToken ? `${accessToken.substring(0, 20)}...` : 'None'}</p>
        <p>✓ LocalStorage Token: {typeof window !== 'undefined' ? (localStorage.getItem('accessToken') ? 'Present' : 'Missing') : 'N/A'}</p>
      </div>
    </div>
  );
}
