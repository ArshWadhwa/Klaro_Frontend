/** @type {import('next').NextConfig} */
const backendOrigin = (process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://klaro-5mr5.onrender.com').replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
