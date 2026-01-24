import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // <--- Esto genera HTML estático en la carpeta 'out'  
  images: {
    // unoptimized: false, // Por defecto es false, así que al quitar true se activa la optimización
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
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|ico)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;