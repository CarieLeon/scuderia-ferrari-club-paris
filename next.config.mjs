/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // All imagery is served locally from /public, so no remotePatterns are needed.
  },
};

export default nextConfig;
