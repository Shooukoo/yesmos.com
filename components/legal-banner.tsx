'use client'

import Link from 'next/link'
import { GeometricPattern } from '@/components/ui/geometric-pattern'

export function LegalBanner() {
  return (
    <section className="relative bg-gradient-to-b from-[#3b82f6] to-[#2563eb] overflow-hidden mt-12 md:mt-16 mb-6 md:mb-8">
      {/* Geometric pattern background */}
      <GeometricPattern />

      {/* Content container with relative positioning (above pattern) */}
      <div className="relative z-10 container mx-auto px-5 py-8 sm:px-10 sm:py-10 md:py-12 lg:px-12">
        {/* Desktop: Grid 2 columns, Mobile: Flex column */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center">
          {/* Left column: Text content */}
          <div className="flex flex-col justify-center">
            {/* Headline: Serif, bold, white */}
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
              IMPORTANTE: Precios Mayoristas
            </h3>

            {/* Body text: Inter, off-white */}
            <p className="text-base sm:text-lg text-[#f8f6f1] font-medium mb-3 leading-relaxed">
              Los precios mostrados son tarifa{' '}
              <strong className="font-bold">exclusiva para reparadores profesionales</strong> de la
              región.
            </p>

            {/* Secondary text: Slightly recessed */}
            <p className="text-sm sm:text-base text-[#f8f6f1] text-opacity-85 mb-6 leading-relaxed">
              ¿Eres cliente final? Usa nuestro cotizador para ver precios especiales al público.
            </p>

            {/* Button: White background, blue text */}
            <div className="flex">
              <Link
                href="/cotizaciones"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-white text-[#3b82f6] px-7 font-semibold hover:bg-opacity-90 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:shadow-[rgba(59,130,246,0.15)] select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ver precios al público →
              </Link>
            </div>
          </div>

          {/* Right column: Spacing column for desktop layout (pattern rendered at section level) */}
          <div className="hidden md:flex items-center justify-center min-h-[100px]">
          </div>
        </div>
      </div>
    </section>
  )
}
