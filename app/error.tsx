"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="bg-white p-6 rounded-full shadow-lg border border-gray-100">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Algo salió mal</h2>
        <p className="text-gray-500 max-w-sm">
          No se pudo cargar el contenido. Por favor intenta de nuevo.
        </p>
      </div>
      <Button
        onClick={reset}
        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 rounded-full"
      >
        Intentar de nuevo
      </Button>
    </div>
  )
}
