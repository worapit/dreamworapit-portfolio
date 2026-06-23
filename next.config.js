/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Ensure GSAP is only bundled for the browser
  experimental: {
    optimizePackageImports: ['gsap'],
  },
};

module.exports = nextConfig;
