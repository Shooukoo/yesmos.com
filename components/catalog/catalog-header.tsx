import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function CatalogHeader() {
    return (
        <section className="bg-[#f3f4f6] py-10 md:py-16">
            <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2">
                {/* Izquierda: título + breadcrumb */}
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
                        Catálogo de Refacciones
                    </h1>
                    <Breadcrumb className="mt-3">
                        <BreadcrumbList className="justify-center md:justify-start">
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/">Inicio</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Catálogo</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Derecha: logo + datos de contacto */}
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center md:justify-end">
                    <div className="relative h-36 w-36 flex-shrink-0 overflow-hidden rounded-xl bg-white p-4 shadow-sm">
                        <div className="relative h-full w-full">
                            <Image
                                src="/Logo_Yesmos_Celu_Azul.png"
                                alt="Logo Yesmos Refacciones"
                                fill
                                className="object-contain"
                                priority
                                sizes="144px"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-center text-sm text-gray-600 sm:text-left">
                        <p className="font-medium text-gray-900">Existencias y precios actualizados al día</p>
                        <p className="flex items-center justify-center gap-2 sm:justify-start">
                            <MapPin className="h-4 w-4 flex-shrink-0 text-[#3b82f6]" />
                            Av. Constitución #206, Centro, Sahuayo, Mich.
                        </p>
                        <p className="flex items-center justify-center gap-2 sm:justify-start">
                            <Phone className="h-4 w-4 flex-shrink-0 text-[#3b82f6]" />
                            WhatsApp: 353 184 4881
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
