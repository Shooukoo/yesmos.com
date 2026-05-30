import type { Metadata } from "next"
import { CotizadorClient } from "./CotizadorClient"

export const metadata: Metadata = {
  title: "Cotizador POS",
  description: "Genera cotizaciones y tickets de venta para tus clientes. Calcula precios, agrega mano de obra y envía por WhatsApp.",
}

export default function CotizacionesPage() {
  return <CotizadorClient />
}
