/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: [
      'route-management-storge.s3.ap-southeast-1.amazonaws.com',
      'route-management-storge.s3.amazonaws.com',
    ],
  },
  
  // ✅ Tắt ESLint khi build (ví dụ khi deploy lên Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
