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

const ITEMS_PER_PAGE = 12; // Cantidad de productos a cargar por bloque

export function ProductCatalog() {
    // Estados de datos
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // Estados de filtros y carrito
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
    const [cartCount, setCartCount] = useState(0)
    const [cartTotal, setCartTotal] = useState(0)

    // Estado para paginación "Cargar más"
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

    // 1. Obtener datos del Scraping al cargar
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("api/refacciones.php") // Ruta relativa al archivo PHP
                if (!response.ok) throw new Error("Error fetching data")
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

    // Reiniciar la paginación cuando cambian los filtros
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE)
    }, [searchQuery, selectedCategory])

    // 2. Generar categorías dinámicamente
    const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))]

    // 3. Lógica de filtrado
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // 4. Productos a mostrar (Paginados)
    const displayedProducts = filteredProducts.slice(0, visibleCount)

    // Función para cargar más
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
    }

    const addToCart = (price: number) => {
        setCartCount((prev) => prev + 1)
        setCartTotal((prev) => prev + price)
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#3b82f6]" />
                <p className="text-gray-500">Cargando catálogo de refacciones...</p>
            </div>
        )
    }

    return (
        <section className="container mx-auto px-4 py-8" id="catalogo">
            
            {/* Información de la Tienda */}
            <div className="mb-12 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <div className="text-center md:text-left space-y-3">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">CATÁLOGO DIGITAL</h1>
                        <p className="text-blue-600 font-medium">Refacciones y Accesorios en Tiempo Real</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 bg-white/50 p-4 rounded-lg">
                        <p className="flex items-center justify-center gap-2 md:justify-start">
                            <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                            <span>Av. Constitución #206, Centro, Sahuayo, Michoacán</span>
                        </p>
                        <p className="flex items-center justify-center gap-2 md:justify-start">
                            <Phone className="h-4 w-4 text-green-500 shrink-0" />
                            <span>WhatsApp: 353 184 4881</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Barra de Búsqueda */}
            <div className="mb-8 flex w-full items-center gap-0 max-w-3xl mx-auto">
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Buscar refacción..."
                        className="h-12 w-full rounded-r-none border-blue-300 bg-white pl-4 text-base focus-visible:ring-blue-500 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    className="h-12 rounded-l-none border border-l-0 border-blue-300 bg-blue-50 px-6 text-blue-600 hover:bg-blue-100"
                    variant="ghost"
                >
                    <Search className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                {/* Filtros Laterales */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 rounded-lg border bg-white p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 border-b pb-2">
                            <Filter className="h-4 w-4" /> FILTROS
                        </h3>

                        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-3">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2 group">
                                    <RadioGroupItem
                                        value={category}
                                        id={`cat-${category}`}
                                        className="text-blue-600 border-gray-300 focus:border-blue-500"
                                    />
                                    <Label
                                        htmlFor={`cat-${category}`}
                                        className="cursor-pointer text-sm text-gray-600 group-hover:text-blue-600 transition-colors w-full py-1"
                                    >
                                        {category}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>

                {/* Rejilla de Productos */}
                <div className="md:col-span-3 lg:col-span-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            Resultados ({filteredProducts.length})
                        </h3>
                        <span className="text-sm text-gray-500">
                            Mostrando {Math.min(visibleCount, filteredProducts.length)} de {filteredProducts.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group relative flex flex-col overflow-hidden rounded-xl border bg-white transition-all hover:shadow-xl hover:border-blue-200 animate-in fade-in duration-500"
                            >
                                {product.available && (
                                    <Badge className="absolute top-3 right-3 z-10 bg-green-500 hover:bg-green-600">
                                        Disponible
                                    </Badge>
                                )}

                                <div className="aspect-square relative mb-2 overflow-hidden bg-gray-50 p-6">
                                    <Image
                                        src={product.image && product.image.startsWith('http') ? product.image : "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col p-4 pt-0">
                                    <div className="mb-2">
                                        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] mt-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-gray-100">
                                        <div className="flex items-end justify-between mb-3">
                                            <span className="text-xs text-gray-400">Precio Lista</span>
                                            <span className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                onClick={() => addToCart(product.price)}
                                                variant="outline"
                                                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                                                size="sm"
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                Agregar
                                            </Button>
                                            <Button
                                                asChild
                                                className="w-full bg-[#111827] hover:bg-gray-800 text-white"
                                                size="sm"
                                            >
                                                <a href={product.url} target="_blank" rel="noopener noreferrer">
                                                    Ver <ExternalLink className="h-3 w-3 ml-1" />
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
                        <div className="mt-10 flex justify-center">
                            <Button
                                onClick={handleLoadMore}
                                variant="outline"
                                className="min-w-[200px] border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <ChevronDown className="mr-2 h-4 w-4" />
                                Cargar más productos
                            </Button>
                        </div>
                    )}

                    {filteredProducts.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No encontramos resultados</h3>
                            <p className="text-gray-500">Intenta con otros términos de búsqueda.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Widget Flotante del Carrito */}
            {cartCount > 0 && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <Button
                        className="flex h-auto flex-col items-stretch rounded-2xl border-2 border-blue-500 bg-white px-6 py-3 text-gray-900 shadow-2xl hover:bg-blue-50 transition-transform hover:scale-105"
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2 mb-1">
                            <div className="flex items-center gap-2 text-blue-600">
                                <ShoppingCart className="h-5 w-5 fill-current" />
                                <span className="font-bold text-lg">{cartCount}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium uppercase">Mi Pedido</span>
                        </div>
                        <span className="text-xl font-black text-gray-900 text-right">
                            ${cartTotal.toFixed(2)}
                        </span>
                    </Button>
                </div>
            )}
        </section>
    )
}