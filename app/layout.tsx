/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Suspense } from "react"
import { Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"], variable: '--font-sans' })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"], variable: '--font-mono' })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"], variable: '--font-serif' })

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
  metadataBase: new URL("https://www.yesmos.com"), // Tu dominio real
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
        url: "/Logo_Yesmos_Celu_Azul.png", // Usamos tu logo como imagen principal
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
    images: ["/Logo_Yesmos_Celu_Azul.png"],
    creator: "@yesmos", // Tu usuario de twitter si tienes
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
  return (
    <html lang="es">
      <body className={`${_inter.variable} font-sans antialiased`}>
        <Suspense>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}