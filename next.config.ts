import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    // disables some aggressive TS rewrites in dev
  },
};

export default nextConfig;
