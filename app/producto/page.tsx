import { Suspense } from "react"
import type { Metadata } from "next"
import { ProductoClient, ProductDetailSkeleton } from "./ProductoClient"

export const metadata: Metadata = {
  title: "Detalle de Producto",
  description: "Consulta información, precio y disponibilidad de refacciones y accesorios para celulares en Yesmos Celulares, Sahuayo.",
}

export default function ProductoPage() {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductoClient />
    </Suspense>
  )
}
