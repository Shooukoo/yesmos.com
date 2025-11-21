import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Wrench, Cpu, ShoppingBag } from "lucide-react"
import { services } from "@/lib/data"

const iconMap = {
  Smartphone: Smartphone,
  Wrench: Wrench,
  Cpu: Cpu,
  ShoppingBag: ShoppingBag,
}

export function ServicesSection() {
  return (
    <section id="servicios" className="py-12 md:py-24 bg-[#f9fafb]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#111827]">
            Nuestros Servicios
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Todo lo que necesitas para tu dispositivo móvil en un solo lugar.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]
            return (
              <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-col items-center pb-2">
                  <div className="p-3 rounded-full bg-[#9ec7e8]/20 mb-4">
                    <Icon className="h-8 w-8 text-[#3b82f6]" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#111827]">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-500">
                  <p>{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
