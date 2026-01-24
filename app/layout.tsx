/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import { Inter as V0_Font_Inter } from 'next/font/google'
import Script from 'next/script' // <--- Importamos Script para mejor manejo (opcional, pero nativo es mejor aqui)

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: "Yesmos Celulares - Refacciones y Servicio Técnico",
    template: "%s | Yesmos Celulares",
  },
  description: "Venta de celulares, refacciones originales y servicio técnico especializado en Sahuayo. Encuentra displays, baterías y más.",
  keywords: [
    "Yesmos",
    "Celulares",
    "Refacciones",
    "Sahuayo",
    "Reparación de celulares",
    "Pantallas",
    "Baterías",
    "Servicio Técnico",
    "Tecnología móvil",
    "Displays",
  ],
  authors: [{ name: "Yesmos Celulares" }],
  creator: "Yesmos Celulares",
  publisher: "Yesmos Celulares",
  metadataBase: new URL("https://www.yesmos.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yesmos Celulares - Refacciones y Servicio Técnico",
    description: "Soluciones tecnológicas integrales para tu móvil. Calidad y confianza en Sahuayo.",
    url: "https://www.yesmos.com",
    siteName: "Yesmos.com",
    images: [
      {
        url: "/opg-yesmos-celulares.png",
        width: 1200,
        height: 630,
        alt: "Yesmos Celulares Logo",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yesmos Celulares",
    description: "Refacciones, celulares y servicio técnico en Sahuayo.",
    images: ["/opg-yesmos-celulares.png"],
    creator: "@yesmos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/Logo_Yesmos_Celu_Azul.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/Logo_Yesmos_Celu_Azul.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/Logo_Yesmos_Celu_Azul.png',
        type: 'image/png',
      },
    ],
    apple: '/Logo_Yesmos_Celu_Azul.png',
    shortcut: '/Logo_Yesmos_Celu_Azul.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Definimos los datos estructurados para Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness", // Indica que es un negocio local físico
    "name": "Yesmos Celulares",
    "image": "https://www.yesmos.com/opg-yesmos-celulares.png",
    "logo": "https://www.yesmos.com/Logo_Yesmos_Celu_Azul.png", // <--- ESTO ES LO QUE BUSCA GOOGLE
    "description": "Venta de celulares, refacciones originales y servicio técnico especializado en Sahuayo.",
    "telephone": "+523531844881",
    "url": "https://www.yesmos.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Constitución #206",
      "addressLocality": "Sahuayo",
      "addressRegion": "Michoacán",
      "postalCode": "59000",
      "addressCountry": "MX"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.0587903, 
      "longitude": -102.7162354
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:30",
        "closes": "14:30" 
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "16:30", 
        "closes": "20:00" 
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "09:30",
        "closes": "15:00"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <html lang="es">
      <body className={`${_inter.variable} font-sans antialiased`}>
        {/* Script JSON-LD inyectado para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <Suspense>
          {children}
        </Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}