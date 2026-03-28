import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // fhevm ships .sol Solidity files — exclude it from bundling entirely.
  // It's loaded via dynamic import() at browser runtime only.
  serverExternalPackages: ["fhevm", "fhevmjs"],

  // Turbopack config (Next 16 default dev bundler)
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".css"],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
