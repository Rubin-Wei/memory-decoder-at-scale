import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/memory-decoder-at-scale" : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
