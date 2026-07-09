import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-00d6c2dae3cc4e98aac31fbd24a8beb1.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-fb105eed8b124a4bab5a89a064798a3f.r2.dev',
      },
    ],
  },
};

export default withPayload(nextConfig);
