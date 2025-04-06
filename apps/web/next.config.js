/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/meside/server/:path*",
        destination: `${process.env.SERVER_DOMAIN}meside/server/:path*`,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
