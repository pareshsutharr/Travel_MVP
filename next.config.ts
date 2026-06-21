import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "images.pexels.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
