/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // تعطيل التخزين المؤقت في وضع التطوير
  cache: process.env.NODE_ENV === 'development' ? false : true,
};

module.exports = nextConfig;