import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // disable PWA in dev
  buildExcludes: [/app-build-manifest\.json$/],
});

//  Combined Next.js configuration
const nextConfig: NextConfig = {
  eslint: {
    // Skip all ESLint errors during production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // skip TypeScript type errors too
    ignoreBuildErrors: true,
  },
  reactStrictMode: true, // enable strict mode for better debugging

  async rewrites() {
    return [
      // Allow Auth0 routes to be handled by Next.js itself
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      // Forward all other /api requests to the Express backend
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },

  webpack: (config) => {
    // ensure next-pwa works properly with webpack
    return config;
  },
};

//  Export Next.js config wrapped with PWA support
export default withPWA(nextConfig);
