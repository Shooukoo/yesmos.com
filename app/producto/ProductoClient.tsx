"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, Tag, Barcode, PackageX, MessageCircle, ExternalLink, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProducts, type Product } from "@/lib/products-cache"

export function ProductDetailSkeleton() {
    return (
        <div className="flex min-h-screen flex-col bg-[#f9fafb]">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-10 max-w-5xl">
                    {/* Breadcrumb skeleton */}
                    <Skeleton className="mb-6 h-8 w-40 rounded-lg" />

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">
                        {/* Imagen skeleton */}
                        <Skeleton className="aspect-square w-full rounded-2xl" />

                        {/* Info skeleton */}
                        <div className="flex flex-col">
                            {/* Badges row */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-20 rounded-full" />
                                <Skeleton className="h-5 w-24 rounded-full" />
                            </div>
                            {/* Nombre */}
                            <Skeleton className="mt-3 h-8 w-full rounded-md" />
                            <Skeleton className="mt-2 h-8 w-4/5 rounded-md" />
                            {/* Precio */}
                            <div className="mt-5 flex items-baseline gap-2">
                                <Skeleton className="h-10 w-36 rounded-md" />
                                <Skeleton className="h-4 w-10 rounded-md" />
                            </div>
                            {/* CTAs */}
                            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                                <Skeleton className="h-11 flex-1 rounded-full" />
                                <Skeleton className="h-11 flex-1 rounded-full" />
                            </div>
                            <Skeleton className="mt-3 mx-auto h-3.5 w-44 rounded-md" />
                            {/* Footer info */}
                            <Skeleton className="mt-6 h-px w-full" />
                            <div className="mt-4 space-y-2">
                                <Skeleton className="h-4 w-48 rounded-md" />
                                <Skeleton className="h-4 w-56 rounded-md" />
                                <Skeleton className="h-4 w-32 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export function ProductoClient() {
    const searchParams = useSearchParams()
    const id = searchParams.get("id")

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        if (!id) {
            setNotFound(true)
            setLoading(false)
            return
        }

        getProducts()
            .then((products) => {
                const found = products.find((p) => String(p.id) === String(id))
                if (found) setProduct(found)
                else setNotFound(true)
            })
            .catch((err) => {
                console.error(err)
                setNotFound(true)
            })
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return <ProductDetailSkeleton />
    }

    if (notFound || !product) {
        return (
            <div className="flex min-h-screen flex-col bg-[#f9fafb]">
                <Header />
                <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
                    <PackageX className="h-16 w-16 text-gray-300" />
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
                        <p className="text-gray-500">Este producto no existe o ya no está disponible en el catálogo.</p>
                    </div>
                    <Button asChild className="mt-2 rounded-full bg-[#3b82f6] px-8 text-white hover:bg-[#2563eb]">
                        <Link href="/#catalogo">Ver catálogo</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        )
    }

    const whatsappMessage = encodeURIComponent(
        `Hola, me interesa este producto del catálogo:\n\n*${product.name}*\nPrecio: $${product.price.toFixed(2)}\n\n¿Está disponible?`
    )

    return (
        <div className="flex min-h-screen flex-col bg-[#f9fafb]">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-10 max-w-5xl">

                    {/* Breadcrumb */}
                    <Link
                        href="/#catalogo"
                        className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-[#3b82f6] transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al catálogo
                    </Link>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">

                        {/* ── Imagen ── */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <Image
                                src={
                                    product.image && product.image.startsWith("http")
                                        ? product.image
                                        : "https://placehold.co/600x600?text=Sin+Imagen"
                                }
                                alt={product.name}
                                fill
                                className="object-contain p-8 transition-transform duration-500 hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />

                            {/* Badge de stock sobre la imagen */}
                            <div className="absolute left-3 top-3">
                                {product.available ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-bold text-green-700">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        En stock{product.stock !== undefined ? ` · ${product.stock} uds.` : ""}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-600">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                        Sin stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ── Info ── */}
                        <div className="flex flex-col justify-start">

                            {/* Categoría + Estado en la misma fila */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="w-fit bg-blue-50 text-[#3b82f6] uppercase text-[10px] font-bold tracking-wider">
                                    <Tag className="mr-1.5 h-3 w-3" />
                                    {product.category}
                                </Badge>
                                {product.available ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Disponible
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
                                        <XCircle className="h-3 w-3" />
                                        Sin existencias
                                    </span>
                                )}
                            </div>

                            {/* Nombre */}
                            <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                                {product.name}
                            </h1>

                            {/* Precio */}
                            <div className="mt-5 flex items-baseline gap-2">
                                <span className="text-4xl font-black tabular-nums text-gray-900">
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className="text-sm font-medium text-gray-400">MXN</span>
                            </div>

                            {/* CTAs */}
                            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                                <Button
                                    asChild
                                    className="h-11 flex-1 rounded-full bg-[#25d366] text-white hover:bg-[#1ebe5d] font-bold shadow-md shadow-green-200/60 transition-all hover:-translate-y-0.5"
                                >
                                    <a
                                        href={`https://wa.me/523531844881?text=${whatsappMessage}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Consultar por WhatsApp
                                    </a>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-11 flex-1 rounded-full border-gray-200 text-gray-600 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all"
                                >
                                    <Link href="/cotizaciones">
                                        Cotizar precio
                                    </Link>
                                </Button>
                            </div>

                            {/* Enlace proveedor — subordinado */}
                            <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <ExternalLink className="h-3 w-3" />
                                Ver en catálogo del proveedor
                            </a>

                            {/* Info de tienda */}
                            <div className="mt-6 border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-500">
                                {product.barcode && (
                                    <p className="flex items-center gap-2">
                                        <Barcode className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                        <span className="text-gray-400">Cód. barras:</span>
                                        <span className="font-mono text-gray-600">{product.barcode}</span>
                                    </p>
                                )}
                                <p className="flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                    Av. Constitución #206, Sahuayo, Mich.
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                    353 184 4881
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
