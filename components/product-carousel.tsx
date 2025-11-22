"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ExternalLink, Loader2, AlertCircle } from "lucide-react"

// Definimos la estructura de los datos que recibiremos de la API
interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  url: string
  available: boolean
}

export function ProductCarousel() {
  // Estados para manejar los datos, la carga y posibles errores
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Llamada a tu API de scraping
        const response = await fetch("/api/refacciones")
        
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor")
        }
        
        const data = await response.json()
        
        // Validamos que recibimos un array
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        } else {
          // Si el array está vacío, activamos estado de error/vacío
          console.warn("La API devolvió una lista vacía")
          setError(true)
        }
      } catch (err) {
        console.error("Error cargando productos:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Estado de Carga (Loading)
  if (loading) {
    return (
      <section id="refacciones" className="py-24 bg-white min-h-[400px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <Loader2 className="h-10 w-10 animate-spin text-[#3b82f6]" />
          <p className="text-gray-500 font-medium">Buscando mejores precios en tiempo real...</p>
        </div>
      </section>
    )
  }

  // Estado de Error o Sin Datos
  if (error || products.length === 0) {
    return (
      <section id="refacciones" className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="h-12 w-12 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900">Catálogo temporalmente no disponible</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No pudimos cargar las refacciones en este momento. Por favor, contáctanos directamente para cotizar.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Estado de Éxito (Mostrar Carrusel)
  return (
    <section id="refacciones" className="py-12 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#111827]">
            Refacciones Disponibles
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Precios actualizados al momento directamente de nuestros proveedores.
          </p>
        </div>
        
        <div className="mx-auto max-w-6xl px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4 pb-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="overflow-hidden border-gray-200 hover:shadow-lg hover:border-[#3b82f6]/30 transition-all duration-300 h-full flex flex-col group">
                      <div className="relative aspect-square bg-gray-50 p-4 flex items-center justify-center">
                        {/* Usamos una imagen por defecto si la del producto falla o no existe */}
                        <Image
                          src={product.image && product.image.startsWith('http') ? product.image : "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {product.available && (
                          <Badge className="absolute top-3 right-3 bg-green-500/90 hover:bg-green-600 backdrop-blur-sm shadow-sm">
                            Disponible
                          </Badge>
                        )}
                      </div>
                      
                      <CardContent className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                            {product.category}
                          </div>
                          <h3 className="font-bold text-lg leading-snug text-[#111827] mb-3 line-clamp-2 min-h-[3.5rem]" title={product.name}>
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-2xl font-extrabold text-[#3b82f6]">
                          ${product.price.toFixed(2)}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-5 pt-0 mt-auto">
                        <Button 
                          className="w-full bg-[#111827] hover:bg-[#3b82f6] text-white transition-colors duration-300 group-hover:shadow-md"
                          asChild
                        >
                          <a href={product.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10 border-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white" />
            <CarouselNext className="hidden md:flex -right-12 h-10 w-10 border-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}