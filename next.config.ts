import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Set per build by scripts/deploy.sh (build-a, then build-b).
  deploymentId: process.env.DEPLOYMENT_ID,
  env: {
    BUILD_LABEL: process.env.DEPLOYMENT_ID,
  },
};

export default nextConfig;
