import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Notion-hosted images (S3 signed URLs)
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      // Legacy Notion static images
      {
        protocol: "https",
        hostname: "secure.notion-static.com",
      },
      // Notion website images / inline media
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      // General S3 buckets used by Notion
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3-us-west-2.amazonaws.com",
      },
      // Notion emoji / icon CDN
      {
        protocol: "https",
        hostname: "notion.so",
      },
    ],
  },
};

export default nextConfig;
