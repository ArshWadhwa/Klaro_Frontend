import type { Metadata } from 'next';
import './globals.css';
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Klaro - AI-Powered Issue Tracker',
  description: 'Collaborative project management and issue tracking for development teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        {children}
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
      </body>
    </html>
  );
}
