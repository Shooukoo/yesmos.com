"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ExternalLink } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  available: boolean
}

interface ProductCarouselProps {
  products: Product[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  return (
    <section id="refacciones" className="py-12 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#111827]">
            Refacciones Destacadas
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Encuentra displays, baterías, tapas y más. Actualizado en tiempo real.
          </p>
        </div>
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="relative aspect-square bg-gray-100">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.available && (
                          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">Disponible</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                        <h3 className="font-bold text-lg line-clamp-2 mb-2 h-14 text-[#111827]">{product.name}</h3>
                        <div className="text-2xl font-bold text-[#3b82f6]">${product.price.toFixed(2)}</div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full bg-[#111827] hover:bg-[#111827]/90 text-white">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver en Proveedor
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10" />
            <CarouselNext className="hidden md:flex -right-12 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
