/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@platform/types', '@platform/database'],
};

module.exports = nextConfig;
