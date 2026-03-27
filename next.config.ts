import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/norinori1-WebSite",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
