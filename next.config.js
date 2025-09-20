/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // cache: process.env.NODE_ENV === 'development' ? false : true,
};

module.exports = nextConfig;