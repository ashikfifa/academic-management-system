import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const defaultApiUrl = "http://localhost:4000";
    const configuredApiUrl = process.env.API_SERVER_URL ?? defaultApiUrl;
    const apiUrl = configuredApiUrl.replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
