import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'filedn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.anegocios.com.mx', // Agrego este por si acaso alguna imagen viene directo de ahí
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;