"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, ShoppingCart, Phone, MapPin, Filter, Loader2, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

interface Product {
    id: number
    name: string
    price: number
    category: string
    image: string
    url: string
    available: boolean
}

const ITEMS_PER_PAGE = 12; // Cantidad inicial de productos

export function ProductCatalog() {
    // Estados de datos
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // Estados de UI
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
    const [cartCount, setCartCount] = useState(0)
    const [cartTotal, setCartTotal] = useState(0)

    // Estado para paginación
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

    // 1. Carga de datos (Lógica Híbrida Local/HostGator)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // En desarrollo usa la API de Next.js, en producción busca el archivo PHP
                const apiUrl = process.env.NODE_ENV === 'development'
                    ? "/api/refacciones"
                    : "api/refacciones.php";

                const response = await fetch(apiUrl)

                if (!response.ok) {
                    if (apiUrl.includes('.php')) {
                        console.warn("Fallo carga PHP, intentando API route...");
                        const retry = await fetch("/api/refacciones");
                        if (retry.ok) {
                            const data = await retry.json();
                            setProducts(data);
                            return;
                        }
                    }
                    throw new Error("Error fetching data");
                }

                const data = await response.json()
                setProducts(data)
            } catch (error) {
                console.error("Error cargando catálogo:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Reiniciar paginación al filtrar
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE)
    }, [searchQuery, selectedCategory])

    // 2. Obtener categorías únicas del scraping
    const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category))).sort()]

    // 3. Filtrado
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // 4. Paginación
    const displayedProducts = filteredProducts.slice(0, visibleCount)

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
    }

    const addToCart = (price: number) => {
        setCartCount((prev) => prev + 1)
        setCartTotal((prev) => prev + price)
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-[#3b82f6]" />
                <p className="text-gray-500 font-medium">Sincronizando catálogo con proveedores...</p>
            </div>
        )
    }

    return (
        <section className="container mx-auto px-4 py-8" id="catalogo">

            {/* Cabecera de Tienda */}
            <div className="mb-12 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {/* Logo de la tienda (ACTUALIZADO) */}
                <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-lg border bg-blue-50 p-3 shadow-sm overflow-hidden">
                    <div className="relative h-full w-full">
                        <Image
                            src="/Logo_Yesmos_Celu_Azul.png"
                            alt="Logo Yesmos Refacciones"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <div className="text-center md:text-left w-full md:w-auto">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">CATÁLOGO DIGITAL</h1>
                    <p className="mb-4 text-gray-500">Refacciones y Accesorios en Tiempo Real</p>
                    <div className="space-y-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-md inline-block w-full md:w-auto">
                        <p className="flex items-center justify-center gap-2 md:justify-start">
                            <MapPin className="h-4 w-4 text-[#3b82f6]" />
                            Av. Constitución #206, Centro, Sahuayo, Mich.
                        </p>
                        <p className="flex items-center justify-center gap-2 md:justify-start">
                            <Phone className="h-4 w-4 text-[#3b82f6]" />
                            WhatsApp: 353 184 4881
                        </p>
                    </div>
                </div>
            </div>

            {/* Barra de Búsqueda */}
            <div className="mb-8 flex w-full items-center gap-0 max-w-4xl mx-auto shadow-sm">
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Buscar refacción..."
                        className="h-12 w-full rounded-r-none border-gray-300 bg-white pl-4 text-base focus-visible:ring-[#3b82f6] focus-visible:border-[#3b82f6]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    className="h-12 rounded-l-none border border-l-0 border-gray-300 bg-gray-50 px-6 text-gray-500 hover:bg-gray-100 hover:text-[#3b82f6]"
                    variant="ghost"
                >
                    <Search className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                {/* Sidebar Filtros */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 rounded-lg border bg-white p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 border-b pb-3">
                            FILTROS <Filter className="h-4 w-4" />
                        </h3>

                        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-3">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2 group cursor-pointer">
                                    <RadioGroupItem
                                        value={category}
                                        id={`cat-${category}`}
                                        className="text-[#3b82f6] border-gray-300 data-[state=checked]:border-[#3b82f6]"
                                    />
                                    <Label
                                        htmlFor={`cat-${category}`}
                                        className="cursor-pointer text-sm font-medium text-gray-600 group-hover:text-[#3b82f6] transition-colors w-full py-1"
                                    >
                                        {category}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>

                {/* Grid de Productos */}
                <div className="md:col-span-3 lg:col-span-4">
                    <div className="flex justify-between items-end mb-6 pb-2 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Resultados</h3>
                        <span className="text-sm text-gray-500 font-medium">
                            Mostrando {Math.min(visibleCount, filteredProducts.length)} de {filteredProducts.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg hover:border-[#3b82f6]/30 animate-in fade-in zoom-in-95 duration-300"
                            >
                                <div className="aspect-square relative mb-0 overflow-hidden bg-white border-b border-gray-50">
                                    <a href={product.url} target="_self" className="block h-full w-full p-4" title="img-product">
                                        <Image
                                            src={product.image && product.image.startsWith('http') ? product.image : "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </a>
                                </div>

                                {/* Contenido */}
                                <div className="flex flex-1 flex-col p-4">
                                    <div className="mb-3">
                                        <span className="inline-block text-[10px] font-bold text-[#3b82f6] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                                            {product.category}
                                        </span>
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] leading-snug" title={product.name}>
                                            {product.name}
                                        </h3>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-gray-100">
                                        <p className="mb-3 text-xl font-black text-gray-900 tracking-tight">
                                            ${product.price.toFixed(2)}
                                        </p>

                                        <div className="grid grid-cols-1 gap-2">
                                            {/* Botón Ver (Enlace Real en la misma pestaña) */}
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 h-9 text-sm"
                                            >
                                                <a href={product.url} target="_self">
                                                    Ver Detalles <ExternalLink className="h-3 w-3 ml-2 opacity-50" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botón Cargar Más */}
                    {visibleCount < filteredProducts.length && (
                        <div className="mt-16 flex justify-center pb-8">
                            <Button
                                onClick={handleLoadMore}
                                className="min-w-[250px] bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold h-12 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-base"
                            >
                                <ChevronDown className="mr-2 h-5 w-5" />
                                Cargar más productos
                            </Button>
                        </div>
                    )}

                    {filteredProducts.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No encontramos resultados</h3>
                            <p className="text-gray-500">Intenta cambiar los filtros o buscar otro término.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Widget Flotante del Carrito */}
            {cartCount > 0 && (
                <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <Button className="flex h-auto flex-col items-start rounded-full border border-blue-200 bg-white px-6 py-2 text-[#3b82f6] shadow-xl hover:bg-blue-50 transition-transform hover:scale-105">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 fill-current" />
                            <span className="font-bold">{cartCount}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                    </Button>
                </div>
            )}
        </section>
    )
}