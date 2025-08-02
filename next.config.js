/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/auth/callback',
        destination: '/api/auth/callback',
      },
    ];
  },
};

export default nextConfig;