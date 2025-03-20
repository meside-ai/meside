/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/meside/server/:path*",
        destination: "http://localhost:3003/meside/server/:path*",
      },
    ];
  },
};

export default nextConfig;
