import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // <--- Esto genera HTML estático en la carpeta 'out'  
  images: {
    unoptimized: true, // <--- Desactiva la optimización de imágenes para exportación estática
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