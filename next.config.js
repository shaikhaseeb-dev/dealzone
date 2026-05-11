/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'fakestoreapi.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
