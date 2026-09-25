/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@platform/types',
    '@platform/config-engine',
    '@platform/offline-sync',
    '@platform/print-engine',
  ],
};

module.exports = nextConfig;
