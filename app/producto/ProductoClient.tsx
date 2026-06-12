"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Tag, Barcode, PackageX, MessageCircle, ExternalLink, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RelatedProducts } from "@/components/catalog/related-products"
import { getProducts, type Product } from "@/lib/products-cache"

const BENEFITS = [
    "Existencias y precios verificados al día",
    "Recoge en tienda: Av. Constitución #206, Sahuayo",
    "Te asesoramos para confirmar compatibilidad con tu modelo",
]

export function ProductDetailSkeleton() {
    return (
        <div className="flex min-h-screen flex-col bg-[#f9fafb] pb-24 md:pb-0">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-10 max-w-5xl">
                    {/* Breadcrumb skeleton */}
                    <Skeleton className="mb-6 h-4 w-56 rounded-md" />

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">
                        {/* Imagen skeleton */}
                        <Skeleton className="aspect-square w-full rounded-2xl" />

                        {/* Info skeleton */}
                        <div className="flex flex-col">
                            {/* Nombre */}
                            <Skeleton className="h-8 w-full rounded-md" />
                            <Skeleton className="mt-2 h-8 w-4/5 rounded-md" />
                            {/* Chips */}
                            <div className="mt-3 flex items-center gap-2">
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-6 w-32 rounded-full" />
                            </div>
                            {/* Precio */}
                            <div className="mt-5 flex items-baseline gap-2">
                                <Skeleton className="h-10 w-36 rounded-md" />
                                <Skeleton className="h-4 w-10 rounded-md" />
                            </div>
                            {/* Beneficios */}
                            <div className="mt-6 space-y-2.5">
                                <Skeleton className="h-4 w-3/4 rounded-md" />
                                <Skeleton className="h-4 w-4/5 rounded-md" />
                                <Skeleton className="h-4 w-2/3 rounded-md" />
                            </div>
                            {/* CTAs */}
                            <Skeleton className="mt-7 h-12 w-full rounded-full" />
                            <Skeleton className="mt-2.5 h-11 w-full rounded-full" />
                            <Skeleton className="mt-3 mx-auto h-3.5 w-52 rounded-md" />
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
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        // Resetear estado al cambiar de producto (navegación entre relacionados)
        setLoading(true)
        setProduct(null)
        setNotFound(false)

        if (!id) {
            setNotFound(true)
            setLoading(false)
            return
        }

        getProducts()
            .then((products) => {
                setAllProducts(products)
                const found = products.find((p) => String(p.id) === String(id))
                if (found) setProduct(found)
                else setNotFound(true)
            })
            .catch((err) => {
                console.error(err)
                setNotFound(true)
            })
            .finally(() => setLoading(false))

        // Las navegaciones same-pathname con query pueden preservar scroll
        window.scrollTo({ top: 0 })
    }, [id])

    const related = useMemo(() => {
        if (!product) return []
        return allProducts
            .filter((p) => p.category === product.category && p.id !== product.id)
            .sort((a, b) => Number(b.available) - Number(a.available))
            .slice(0, 4)
    }, [allProducts, product])

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
        `Hola, me interesa este producto del catálogo:\n\n*${product.name}*\nPrecio: $${product.price.toFixed(2)}\n\n${product.available ? "¿Está disponible?" : "¿Cuándo estará disponible?"}`
    )
    const whatsappHref = `https://wa.me/523531844881?text=${whatsappMessage}`

    return (
        <div className="flex min-h-screen flex-col bg-[#f9fafb] pb-24 md:pb-0">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-10 max-w-5xl">

                    {/* Breadcrumb */}
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/">Inicio</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/#catalogo">Catálogo</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="max-w-[200px] truncate sm:max-w-xs">
                                    {product.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">

                        {/* ── Imagen ── */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                            <span
                                className={`absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur-sm ${
                                    product.available ? "text-green-700" : "text-gray-500"
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${product.available ? "bg-green-500" : "bg-gray-400"}`}
                                />
                                {product.available
                                    ? `En stock${product.stock !== undefined ? ` · ${product.stock} uds.` : ""}`
                                    : "Agotado"}
                            </span>

                            <Image
                                src={
                                    product.image && product.image.startsWith("http")
                                        ? product.image
                                        : "https://placehold.co/600x600?text=Sin+Imagen"
                                }
                                alt={product.name}
                                fill
                                className={`object-contain p-10 mix-blend-multiply ${product.available ? "" : "opacity-60 grayscale"}`}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>

                        {/* ── Info ── */}
                        <div className="flex flex-col justify-start">

                            {/* Nombre */}
                            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-3xl">
                                {product.name}
                            </h1>

                            {/* Chips de atributos */}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#3b82f6]">
                                    <Tag className="h-3 w-3" />
                                    {product.category}
                                </span>
                                {product.barcode && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-mono text-xs text-gray-600">
                                        <Barcode className="h-3 w-3" />
                                        {product.barcode}
                                    </span>
                                )}
                                {!product.available && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                                        <XCircle className="h-3 w-3" />
                                        Sin existencias
                                    </span>
                                )}
                            </div>

                            {/* Precio */}
                            <div className="mt-5 flex items-baseline gap-2">
                                <span
                                    className={`text-4xl font-semibold tabular-nums tracking-tight ${
                                        product.available ? "text-gray-900" : "text-gray-400"
                                    }`}
                                >
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className="text-sm font-medium text-gray-400">MXN</span>
                            </div>

                            {/* Beneficios */}
                            <ul className="mt-6 space-y-2.5">
                                {BENEFITS.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-gray-600">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#3b82f6]" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>

                            {/* CTAs */}
                            <div className="mt-7">
                                <Button
                                    asChild
                                    className="h-12 w-full rounded-full bg-[#25d366] font-bold text-white shadow-md shadow-green-200/60 transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
                                >
                                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        {product.available
                                            ? `Consultar por WhatsApp · $${product.price.toFixed(2)}`
                                            : "Preguntar disponibilidad"}
                                    </a>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-2.5 h-11 w-full rounded-full border-gray-200 text-gray-600 transition-all hover:border-[#3b82f6] hover:text-[#3b82f6]"
                                >
                                    <Link href="/cotizaciones">Cotizar precio</Link>
                                </Button>

                                <p className="mt-3 text-center text-xs text-gray-400">
                                    Respuesta en horario de tienda · 353 184 4881
                                </p>
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

                    {/* Productos relacionados */}
                    <RelatedProducts products={related} />
                </div>
            </main>
            <Footer />

            {/* Barra CTA fija (solo móvil) */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
                <div className="container mx-auto flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">Precio</p>
                        <p className="text-lg font-semibold tabular-nums text-gray-900">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>
                    <Button
                        asChild
                        className="h-11 flex-1 rounded-full bg-[#25d366] font-bold text-white hover:bg-[#1ebe5d]"
                    >
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-1.5 h-4 w-4" />
                            {product.available ? "Consultar" : "Preguntar"}
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
