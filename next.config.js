/** @type {import('next').NextConfig} */
const backendOrigin = (process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://klaro-4f3b.onrender.com').replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
