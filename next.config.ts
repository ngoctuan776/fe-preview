import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**"
      }
    ]
  }
};

export default nextConfig;
