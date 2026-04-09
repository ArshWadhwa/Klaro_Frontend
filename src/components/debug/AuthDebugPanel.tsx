'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';

export function AuthDebugPanel() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const { user, accessToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    let decoded = null;
    if (token) {
      try {
        const payload = token.split('.')[1];
        decoded = JSON.parse(atob(payload));
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }

    setTokenInfo({
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      storeToken: accessToken,
      storeUser: user,
      isAuthenticated,
      decoded,
      tokenPreview: token ? token.substring(0, 50) + '...' : 'No token',
    });
  }, [user, accessToken, isAuthenticated]);

  if (!tokenInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-zinc-900 border border-zinc-700 rounded-lg p-4 max-w-md text-xs font-mono z-50">
      <div className="font-bold text-white mb-2">🔍 Auth Debug Panel</div>
      
      <div className="space-y-1 text-zinc-300">
        <div className={tokenInfo.hasToken ? 'text-green-400' : 'text-red-400'}>
          • localStorage token: {tokenInfo.hasToken ? '✅' : '❌'}
        </div>
        <div className={tokenInfo.storeToken ? 'text-green-400' : 'text-red-400'}>
          • Zustand store token: {tokenInfo.storeToken ? '✅' : '❌'}
        </div>
        <div className={tokenInfo.isAuthenticated ? 'text-green-400' : 'text-red-400'}>
          • isAuthenticated: {tokenInfo.isAuthenticated ? '✅' : '❌'}
        </div>
        <div className={tokenInfo.storeUser ? 'text-green-400' : 'text-red-400'}>
          • User in store: {tokenInfo.storeUser ? `✅ ${tokenInfo.storeUser.email}` : '❌'}
        </div>
        
        {tokenInfo.decoded && (
          <>
            <div className="border-t border-zinc-700 my-2 pt-2">
              <div className="text-white font-semibold">Token Payload:</div>
              <div>Email: {tokenInfo.decoded.sub}</div>
              <div>Role: {tokenInfo.decoded.role}</div>
              <div>Expires: {new Date(tokenInfo.decoded.exp * 1000).toLocaleString()}</div>
            </div>
          </>
        )}
        
        <div className="border-t border-zinc-700 my-2 pt-2 text-[10px] break-all">
          Token: {tokenInfo.tokenPreview}
        </div>
      </div>
      
      <button
        onClick={() => {
          const token = localStorage.getItem('accessToken');
          console.log('Full token:', token);
          console.log('Store state:', useAuthStore.getState());
        }}
        className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
      >
        Log to Console
      </button>
    </div>
  );
}
