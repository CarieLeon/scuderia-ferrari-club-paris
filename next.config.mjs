/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    // All imagery is served locally from /public, so no remotePatterns are needed.
  },
};

export default nextConfig;
