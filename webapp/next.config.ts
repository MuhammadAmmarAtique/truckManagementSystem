import type { NextConfig } from "next";

// Next.js configuration
const nextConfig: NextConfig = {
  reactStrictMode: false,

  async rewrites() {
    return [
      // Allow Auth0 routes to be handled by Next.js itself
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      // Forward everything else under /api to the Express backend (for restapis)
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
