import type { Metadata } from "next"
import { PlaneacionClient } from "./PlaneacionClient"

export const metadata: Metadata = {
  title: "Planeación de inventario",
  description: "Productos con stock bajo para reabastecimiento.",
  robots: { index: false, follow: false },
}

export default function PlaneacionPage() {
  return <PlaneacionClient />
}
