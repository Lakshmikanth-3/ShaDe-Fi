import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // fhevm ships WASM files — exclude from server bundling for client components.
  // @zama-fhe/relayer-sdk is used in API routes (Node.js), not externalized.
  serverExternalPackages: ["fhevm", "fhevmjs"],

  // Turbopack config (Next 16 default dev bundler)
  turbopack: {
    root: __dirname,
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
