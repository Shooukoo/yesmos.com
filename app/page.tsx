import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductCatalog } from "@/components/product-catalog" // <--- Cambio aquí
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Yesmos Celulares | Catálogo en Línea",
  description: "Refacciones, celulares y servicio técnico en Sahuayo.",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Reemplazamos el carrusel por el catálogo completo */}
        <ProductCatalog />
        
        <ServicesSection />

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-[#3b82f6] text-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">
              ¿Necesitas soporte técnico?
            </h2>
            <p className="max-w-[600px] mx-auto text-blue-100 mb-8">
              Contáctanos directamente para cotizaciones especiales o dudas sobre refacciones.
            </p>
            <a
              rel="noopener noreferrer"
              href="https://wa.me/523531844881"
              target="_blank"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#3b82f6] px-8 font-bold shadow-lg hover:bg-gray-100 transition-all"
            >
              Chat en WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}