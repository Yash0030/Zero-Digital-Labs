/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/*': ['./data/**/*'],
      '/labA/download/*': ['./data/**/*'],
      '/labB/download/*': ['./data/**/*'],
      '/labC/download/*': ['./data/**/*'],
    },
  },
};

export default nextConfig;