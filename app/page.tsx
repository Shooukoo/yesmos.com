import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductCarousel } from "@/components/product-carousel"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import { products } from "@/lib/data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Yesmos Celulares | Refacciones y Servicio Técnico en Sahuayo",
  description:
    "Venta de celulares, refacciones originales y servicio técnico especializado en Sahuayo. Encuentra displays, baterías y más.",
  openGraph: {
    title: "Yesmos Celulares | Refacciones y Servicio Técnico",
    description: "Soluciones tecnológicas integrales para tu móvil.",
    type: "website",
    locale: "es_MX",
    siteName: "Yesmos Celulares",
  },
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProductCarousel products={products} />
        <ServicesSection />

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-[#3b82f6] text-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              ¿Necesitas una reparación urgente?
            </h2>
            <p className="max-w-[700px] mx-auto text-blue-100 md:text-xl mb-8">
              Contamos con técnicos certificados y refacciones originales para dejar tu equipo como nuevo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-[#3b82f6] shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
                Cotizar Ahora
              </button>
              <button className="inline-flex h-12 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
