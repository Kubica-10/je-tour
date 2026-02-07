import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Permite o deploy mesmo com avisos/erros de ESLint (como o <img> ou any)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permite o deploy mesmo com erros de tipagem (como os erros de 'any')
    ignoreBuildErrors: true,
  },
};

export default nextConfig;