"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts, type Product } from "@/lib/products-cache"
import { CatalogHeader } from "@/components/catalog/catalog-header"
import { LegalBanner } from "@/components/legal-banner"
import {
    CatalogToolbar,
    type SortOption,
    type AvailabilityFilter,
    type GridDensity,
} from "@/components/catalog/catalog-toolbar"
import { ProductCard } from "@/components/catalog/product-card"
import { CatalogPagination } from "@/components/catalog/catalog-pagination"

const ITEMS_PER_PAGE = 24 // Divisible entre 2, 3 y 4 → filas completas en todas las densidades

// Clases literales completas para que Tailwind JIT las detecte
const GRID_BY_DENSITY: Record<GridDensity, string> = {
    3: "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
}

const normalizeText = (text: string) => {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

function SkeletonGrid() {
    return (
        <div className={GRID_BY_DENSITY[4]}>
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="mt-3 h-4 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-1/4" />
                </div>
            ))}
        </div>
    )
}

export function ProductCatalog() {
    // Estados de datos
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // Estados de UI
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
    const [availability, setAvailability] = useState<AvailabilityFilter>("all")
    const [sortBy, setSortBy] = useState<SortOption>("relevance")
    const [density, setDensity] = useState<GridDensity>(4)
    const [currentPage, setCurrentPage] = useState(1)

    const gridTopRef = useRef<HTMLDivElement>(null)
    const isInitialMount = useRef(true)

    // 1. Carga de datos — usa caché compartida para no re-scrapear en cada navegación
    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch((err) => console.error("Error cargando catálogo:", err))
            .finally(() => setLoading(false))
    }, [])

    // Restaurar filtros desde sessionStorage al montar (persiste al navegar al detalle y volver)
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem("yesmos-catalog-filters")
            if (saved) {
                const f = JSON.parse(saved)
                if (f.searchQuery !== undefined) setSearchQuery(f.searchQuery)
                if (f.selectedCategory !== undefined) setSelectedCategory(f.selectedCategory)
                if (f.availability !== undefined) setAvailability(f.availability)
                if (f.sortBy !== undefined) setSortBy(f.sortBy)
                if (f.density !== undefined) setDensity(f.density)
                if (f.currentPage !== undefined) setCurrentPage(f.currentPage)
            }
        } catch {}
    }, [])

    // Guardar filtros en sessionStorage al cambiar (se salta el primer render para no
    // sobreescribir con defaults antes de que el efecto de restauración haya corrido)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        try {
            sessionStorage.setItem(
                "yesmos-catalog-filters",
                JSON.stringify({ searchQuery, selectedCategory, availability, sortBy, density, currentPage }),
            )
        } catch {}
    }, [searchQuery, selectedCategory, availability, sortBy, density, currentPage])

    // Volver a la página 1 al cambiar cualquier filtro u orden
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedCategory, availability, sortBy])

    // 2. Obtener categorías únicas dinámicamente
    const categories = useMemo(() => {
        return ["Todos", ...Array.from(new Set(products.map((p) => p.category))).sort()]
    }, [products])

    // 3. FILTRADO INTELIGENTE (MEJORADO CON TOKENIZACIÓN)
    const filteredProducts = useMemo(() => {
        // A. Pre-procesar la búsqueda: Normalizar y dividir en palabras
        const cleanQuery = normalizeText(searchQuery)
        const queryTerms = cleanQuery.split(" ").filter(Boolean) // ["moto", "g20"]

        return products.filter((product) => {
            // B. Filtro por Categoría
            const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
            if (!matchesCategory) return false

            // C. Filtro por Disponibilidad
            if (availability === "in-stock" && !product.available) return false

            // D. Si no hay búsqueda escrita, pasar (ahorra recursos)
            if (queryTerms.length === 0) return true

            // E. Búsqueda Inteligente (Tokens)
            const cleanName = normalizeText(product.name)

            // Verifica que TODAS las palabras escritas estén en el nombre
            // Permite buscar "g20 moto" y encontrar "Display Moto G20"
            const matchesSearch = queryTerms.every((term) => cleanName.includes(term))

            return matchesSearch
        })
    }, [products, searchQuery, selectedCategory, availability])

    // 4. Ordenamiento (copia el arreglo: nunca mutar el memo anterior)
    const sortedProducts = useMemo(() => {
        if (sortBy === "relevance") return filteredProducts
        const sorted = [...filteredProducts]
        switch (sortBy) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price)
                break
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price)
                break
            case "name-asc":
                sorted.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "es"))
                break
        }
        return sorted
    }, [filteredProducts, sortBy])

    // 5. Paginación (safePage evita el frame con grid vacío antes de que corra el effect de reset)
    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE))
    const safePage = Math.min(currentPage, totalPages)
    const pageProducts = sortedProducts.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE,
    )

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        gridTopRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <>
            <CatalogHeader />

            <LegalBanner />

            <section className="container mx-auto px-4 py-8" id="catalogo">
                {/* Barra de Búsqueda */}
                <div className="relative mx-auto mb-6 w-full max-w-xl">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar refacción..."
                        className="h-11 w-full rounded-md border-gray-200 bg-white pl-10 text-base focus-visible:ring-[#3b82f6]/30 focus-visible:border-[#3b82f6]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div ref={gridTopRef} className="scroll-mt-20" />

                {loading ? (
                    <>
                        <div className="mb-8 border-y border-gray-200 py-3">
                            <Skeleton className="h-11 w-full max-w-md" />
                        </div>
                        <SkeletonGrid />
                    </>
                ) : (
                    <>
                        <CatalogToolbar
                            categories={categories}
                            category={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            availability={availability}
                            onAvailabilityChange={setAvailability}
                            sort={sortBy}
                            onSortChange={setSortBy}
                            density={density}
                            onDensityChange={setDensity}
                            resultCount={sortedProducts.length}
                        />

                        {sortedProducts.length > 0 ? (
                            <>
                                <div className={GRID_BY_DENSITY[density]}>
                                    {pageProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                <CatalogPagination
                                    className="mt-12"
                                    currentPage={safePage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
                                <Search className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900">No encontramos resultados</h3>
                                <p className="text-gray-500">Intenta cambiar los filtros o buscar otro término.</p>
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    )
}
