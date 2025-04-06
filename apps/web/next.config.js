/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/meside/server/:path*",
        destination: "http://localhost:3003/meside/server/:path*",
      },
      {
        source: "/meside/warehouse/:path*",
        destination: "http://localhost:3002/meside/warehouse/:path*",
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
