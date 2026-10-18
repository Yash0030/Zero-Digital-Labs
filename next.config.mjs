/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/[lab]/download/[filename]': ['./data/**/*'],
    '/api/download/[lab]/[filename]': ['./data/**/*'],
  },
};
export default nextConfig;
