/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uploadthing.com' },
      { protocol: 'https', hostname: 'utfs.io' },
    ],
  },
  allowedDevOrigins: [
    'https://*.replit.dev',
    'https://*.replit.app',
    'https://*.kirk.replit.dev',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig





