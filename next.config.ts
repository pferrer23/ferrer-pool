import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'media.formula1.com' },
      { hostname: 'cdn-icons-png.flaticon.com' },
    ],
  },
};

export default nextConfig;
