import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export function LegalBanner() {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-red-600 shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">
              ⚠️ IMPORTANTE: Precios Mayoristas
            </h3>
            <p className="text-red-800 mb-4">
              Los precios mostrados arriba son tarifa <strong>mayorista exclusiva para reparadores profesionales</strong> de la región.
            </p>
            <p className="text-red-800 mb-4">
              ¿Eres cliente final? Usa nuestro cotizador para ver precios al público.
            </p>
            <Link
              href="/cotizaciones"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 text-white px-6 font-semibold hover:bg-red-700 transition-colors"
            >
              Ver precios al público →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
