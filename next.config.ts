import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Requerido para 'output: export'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'filedn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.anegocios.com.mx',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;