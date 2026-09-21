import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: [
    "10.45.87.222:3001",
    "10.45.87.222:3000",
    "10.45.87.222",
    "localhost:3001",
    "localhost:3000",
    "localhost",
    "127.0.0.1:3001",
    "127.0.0.1:3000",
    "127.0.0.1"
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "**.tiktokcdn.com" },
    ],
  },
};

export default nextConfig;
