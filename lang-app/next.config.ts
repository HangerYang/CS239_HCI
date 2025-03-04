import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Indicate that these packages should not be bundled by webpack
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
},
};

export default nextConfig;
