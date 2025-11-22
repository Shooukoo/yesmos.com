import { Button } from "@/components/ui/button"
import { Search, Smartphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f9fafb] py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-block rounded-lg bg-[#9ec7e8]/20 px-3 py-1 text-sm text-[#3b82f6] font-medium w-fit">
              Expertos en Tecnología Móvil
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#111827]">
              Soluciones Tecnológicas y Refacciones para Celulares en Sahuayo
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Encuentra las mejores refacciones, servicio técnico especializado y los smartphones más recientes. Calidad
              y confianza en un solo lugar.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {/* Botón Principal: Lleva al catálogo/refacciones */}
              <Link href="#catalogo" className="w-full sm:w-auto">
                <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white h-11 px-8 w-full">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Ver Catálogo
                </Button>
              </Link>
              
              {/* Botón Secundario: También lleva al catálogo para buscar */}
              <Link href="#catalogo" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 h-11 px-8 bg-transparent w-full"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Refacciones
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto lg:ml-auto flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#9ec7e8] to-[#3b82f6] rounded-full opacity-20 blur-3xl" />
              <Image
                src="/prueba3.jpg" // Usamos tu imagen real
                alt="Reparación de celulares"
                width={500}
                height={500}
                className="relative z-10 object-contain rounded-xl shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}