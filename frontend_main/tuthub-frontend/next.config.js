/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disabling ESLint during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 