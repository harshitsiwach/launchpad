import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpack: (config, { isServer }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding", "tap", "tape", "why-is-node-running");

    if (config.resolve.fallback) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false };
    }

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
