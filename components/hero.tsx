import { Button } from "@/components/ui/button"
import { Search, Smartphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    // Reduje el padding vertical significativamente: de py-12/24/32 a py-8/12/16
    <section className="relative overflow-hidden bg-[#f9fafb] py-8 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Reduje el gap del grid para que esté más compacto */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col justify-center space-y-3"> {/* Menos espacio entre elementos */}
            <div className="inline-block rounded-lg bg-[#9ec7e8]/20 px-3 py-1 text-sm text-[#3b82f6] font-medium w-fit">
              Expertos en Tecnología Móvil
            </div>
            {/* Reduje el tamaño del título: de text-3xl/5xl/6xl a text-2xl/4xl/5xl */}
            <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none text-[#111827]">
              Soluciones Tecnológicas y Refacciones para Celulares en Sahuayo
            </h1>
            {/* Reduje el tamaño del texto descriptivo ligeramente */}
            <p className="max-w-[600px] text-gray-500 text-sm md:text-lg dark:text-gray-400">
              Encuentra las mejores refacciones, servicio técnico especializado y los smartphones más recientes. Calidad
              y confianza en un solo lugar.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-2">
              {/* Botón Principal: Lleva al catálogo/refacciones */}
              <Link href="#catalogo" className="w-full sm:w-auto">
                {/* Ajusté la altura del botón a h-10 para hacerlo un poco más compacto */}
                <Button className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white h-10 px-6 w-full">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Ver Catálogo
                </Button>
              </Link>
              
              {/* Botón Secundario: También lleva al catálogo para buscar */}
              <Link href="#catalogo" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 h-10 px-6 bg-transparent w-full"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Refacciones
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto lg:ml-auto flex items-center justify-center">
            {/* Reduje el contenedor de la imagen de 500px a 350px */}
            <div className="relative w-full max-w-[350px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#9ec7e8] to-[#3b82f6] rounded-full opacity-20 blur-3xl" />
              <Image
                src="/prueba3.jpg"
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