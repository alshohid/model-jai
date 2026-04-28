import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "model.devlaro.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "app.modelbossoffers.com",
        pathname: "/storage/**",
      },

      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],

    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  reactStrictMode: true,
  devIndicators: false,
};

export default nextConfig;
