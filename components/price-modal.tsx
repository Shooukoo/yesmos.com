'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export function PriceModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('yesmos-price-modal-seen')
    if (!hasSeenModal) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('yesmos-price-modal-seen', 'true')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            IMPORTANTE: Precios Mayoristas
          </h2>

          <p className="text-gray-600 mb-4 leading-relaxed">
            Los precios mostrados en esta página son tarifa{' '}
            <strong className="text-gray-900">exclusiva para reparadores profesionales</strong> de
            la región.
          </p>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            ¿No eres reparador profesional? Usa nuestro cotizador para ver los precios al público.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/cotizaciones"
              onClick={handleClose}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#3b82f6]/90 transition-colors text-center"
            >
              Ver precios al público →
            </Link>

            <button
              onClick={handleClose}
              className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-gray-300 text-gray-900 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
