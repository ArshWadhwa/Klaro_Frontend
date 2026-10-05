'use client';

import { useEffect } from 'react';
import { Toaster, toast, useToasterStore } from 'react-hot-toast';

export default function ToastProvider() {
  const { toasts } = useToasterStore();

  // Enforce a strict single-toast limit: keep only the newest visible toast, dismiss older ones
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, index) => index >= 1)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1a1a1d',
          color: '#fff',
          border: '1px solid #2a2a2e',
        },
      }}
    />
  );
}
