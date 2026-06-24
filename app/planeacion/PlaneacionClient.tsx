"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    FileSpreadsheet,
    FileText,
    PackageCheck,
    PackageSearch,
    PackageX,
    SlidersHorizontal,
    X,
    type LucideIcon,
} from "lucide-react"
import { CatalogPagination } from "@/components/catalog/catalog-pagination"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getProducts, type Product } from "@/lib/products-cache"
import { exportToExcel, exportToPdf } from "@/lib/export-utils"

const LOW_STOCK_MIN = 0
const LOW_STOCK_MAX = 5
const CRITICAL_STOCK_MAX = 1
const ITEMS_PER_PAGE = 35

type SecondarySortKey = "cost" | "name"
type SortDir = "asc" | "desc"

function stockBadgeVariant(stock: number) {
    return stock <= CRITICAL_STOCK_MAX ? "destructive" : "secondary"
}

const STAT_TONE_CLASSES = {
    default: "bg-blue-50 text-[#3b82f6]",
    warning: "bg-amber-50 text-amber-600",
    destructive: "bg-red-50 text-red-600",
} as const

function StatCard({
    label,
    value,
    icon: Icon,
    tone = "default",
}: {
    label: string
    value: string | number
    icon: LucideIcon
    tone?: keyof typeof STAT_TONE_CLASSES
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", STAT_TONE_CLASSES[tone])}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="truncate text-xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}

function StatCardsSkeleton() {
    return (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[72px] rounded-2xl" />
            ))}
        </div>
    )
}

function TableSkeleton() {
    return (
        <div className="space-y-2 p-5">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full" />
            ))}
        </div>
    )
}

function SortButton({
    label,
    active,
    dir,
    onClick,
    align = "left",
}: {
    label: string
    active: boolean
    dir: SortDir
    onClick: () => void
    align?: "left" | "right"
}) {
    const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-1 hover:text-gray-900",
                align === "right" && "flex-row-reverse",
            )}
        >
            {label}
            <Icon className={cn("h-3.5 w-3.5", active ? "text-[#3b82f6]" : "text-gray-400")} />
        </button>
    )
}

export function PlaneacionClient() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
    const [stockFilter, setStockFilter] = useState<number | null>(null)
    const [stockSortDir, setStockSortDir] = useState<SortDir>("asc")
    const [secondarySort, setSecondarySort] = useState<{ key: SecondarySortKey; dir: SortDir } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const tableTopRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch((err) => console.error("Error cargando catálogo:", err))
            .finally(() => setLoading(false))
    }, [])

    // Stock bajo: 0 (agotado) a 5 inclusive. Más de 5 queda fuera de la vista.
    const lowStockProducts = useMemo(() => {
        return products.filter(
            (p) =>
                typeof p.stock === "number" &&
                p.stock >= LOW_STOCK_MIN &&
                p.stock <= LOW_STOCK_MAX,
        )
    }, [products])

    // Subconjunto de stock bajo filtrado solo por categoría — los KPIs reaccionan a la
    // categoría seleccionada, pero no al nivel de stock exacto (eso es lo que ellos desglosan).
    const categoryFilteredProducts = useMemo(() => {
        return selectedCategory === "Todos"
            ? lowStockProducts
            : lowStockProducts.filter((p) => p.category === selectedCategory)
    }, [lowStockProducts, selectedCategory])

    // Tres niveles de urgencia: 0 = surtir de inmediato, 1 = en riesgo, 2-5 = zona neutra.
    const stockTierCounts = useMemo(() => {
        let outOfStock = 0
        let atRisk = 0
        let neutral = 0
        for (const p of categoryFilteredProducts) {
            const s = p.stock ?? 0
            if (s === 0) outOfStock++
            else if (s === 1) atRisk++
            else neutral++
        }
        return { outOfStock, atRisk, neutral }
    }, [categoryFilteredProducts])

    const categoryCounts = useMemo(() => {
        const counts = new Map<string, number>()
        for (const p of lowStockProducts) {
            counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
        }
        return counts
    }, [lowStockProducts])

    const categories = useMemo(() => Array.from(categoryCounts.keys()).sort(), [categoryCounts])

    const filteredProducts = useMemo(() => {
        let base: Product[]

        if (stockFilter === LOW_STOCK_MAX) {
            // En el extremo superior del slider, "5" se interpreta como "5 o más" —
            // hay que salir del rango 0-5 y tomar del catálogo completo.
            base = products.filter((p) => typeof p.stock === "number" && p.stock >= LOW_STOCK_MAX)
            if (selectedCategory !== "Todos") {
                base = base.filter((p) => p.category === selectedCategory)
            }
        } else if (stockFilter !== null) {
            base = categoryFilteredProducts.filter((p) => (p.stock ?? 0) === stockFilter)
        } else {
            base = categoryFilteredProducts
        }

        return [...base].sort((a, b) => {
            // Stock es siempre el criterio principal: esta página existe para priorizar
            // reabasto urgente, así que nunca debe perderse al ordenar por otra columna.
            const stockDiff = (a.stock ?? 0) - (b.stock ?? 0)
            const primary = stockSortDir === "asc" ? stockDiff : -stockDiff
            if (primary !== 0) return primary

            if (!secondarySort) return 0
            let diff = 0
            if (secondarySort.key === "cost") diff = (a.costPrice ?? 0) - (b.costPrice ?? 0)
            else diff = a.name.localeCompare(b.name)
            return secondarySort.dir === "asc" ? diff : -diff
        })
    }, [products, categoryFilteredProducts, selectedCategory, stockFilter, stockSortDir, secondarySort])

    const hasResults = filteredProducts.length > 0

    // Volver a la página 1 al cambiar cualquier filtro u orden
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedCategory, stockFilter, stockSortDir, secondarySort])

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
    const safePage = Math.min(currentPage, totalPages)
    const pageProducts = filteredProducts.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE,
    )

    function handlePageChange(page: number) {
        setCurrentPage(page)
        tableTopRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // El primer toque del slider activa el filtro en el valor actual (mín. por defecto),
    // incluso si no hay arrastre — sin esto, al estar en reposo sobre el mínimo, el primer
    // movimiento "salta" directo al segundo valor porque 1 → 1 no dispara onValueChange.
    function activateStockFilter() {
        setStockFilter((prev) => prev ?? LOW_STOCK_MIN)
    }

    function toggleStockSort() {
        setStockSortDir((d) => (d === "asc" ? "desc" : "asc"))
    }

    function toggleSecondarySort(key: SecondarySortKey) {
        setSecondarySort((prev) =>
            prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8 md:px-6">
                {loading ? (
                    <StatCardsSkeleton />
                ) : (
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <StatCard
                            label="Surtir de inmediato"
                            value={stockTierCounts.outOfStock}
                            icon={PackageX}
                            tone="destructive"
                        />
                        <StatCard
                            label="Productos en riesgo"
                            value={stockTierCounts.atRisk}
                            icon={AlertTriangle}
                            tone="warning"
                        />
                        <StatCard label="Zona neutra" value={stockTierCounts.neutral} icon={PackageCheck} />

                        <div className="flex items-center gap-3 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#3b82f6]">
                                <SlidersHorizontal className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-xs font-medium text-gray-500">
                                        {stockFilter === null
                                            ? "Nivel de stock: todos"
                                            : `Nivel de stock: ${stockFilter}${stockFilter === LOW_STOCK_MAX ? "+" : ""}`}
                                    </p>
                                    {stockFilter !== null && (
                                        <button
                                            type="button"
                                            onClick={() => setStockFilter(null)}
                                            className="shrink-0 text-gray-400 hover:text-gray-700"
                                            aria-label="Quitar filtro de nivel de stock"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                                <Slider
                                    min={LOW_STOCK_MIN}
                                    max={LOW_STOCK_MAX}
                                    step={1}
                                    value={[stockFilter ?? LOW_STOCK_MIN]}
                                    onValueChange={([v]) => setStockFilter(v)}
                                    onPointerDown={activateStockFilter}
                                    className={cn("mt-2", stockFilter === null && "opacity-40")}
                                />
                                <div className="mt-1 flex justify-between text-[10px] font-medium text-gray-400">
                                    {Array.from(
                                        { length: LOW_STOCK_MAX - LOW_STOCK_MIN + 1 },
                                        (_, i) => LOW_STOCK_MIN + i,
                                    ).map((n) => (
                                        <span key={n} className={cn(stockFilter === n && "text-[#3b82f6]")}>
                                            {n === LOW_STOCK_MAX ? `${n}+` : n}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={tableTopRef} className="scroll-mt-20" />

                <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm">
                    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200/60 px-5 py-4">
                        <div className="flex min-w-0 flex-col gap-1.5">
                            <Label
                                htmlFor="filtro-categoria-planeacion"
                                className="text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                                Categoría
                            </Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger id="filtro-categoria-planeacion" className="h-11 w-[220px] bg-white">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todos">Todos ({lowStockProducts.length})</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat} ({categoryCounts.get(cat)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{filteredProducts.length} productos</span>
                            <Button
                                variant="outline"
                                disabled={!hasResults}
                                onClick={() => exportToExcel(filteredProducts)}
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Excel
                            </Button>
                            <Button
                                variant="outline"
                                disabled={!hasResults}
                                onClick={() => exportToPdf(filteredProducts)}
                            >
                                <FileText className="h-4 w-4" />
                                PDF
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <TableSkeleton />
                    ) : hasResults ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/60">
                                    <TableHead className="text-xs uppercase tracking-wide text-gray-500">
                                        Código de barras
                                    </TableHead>
                                    <TableHead className="text-xs uppercase tracking-wide text-gray-500">
                                        <SortButton
                                            label="Descripción"
                                            active={secondarySort?.key === "name"}
                                            dir={secondarySort?.key === "name" ? secondarySort.dir : "asc"}
                                            onClick={() => toggleSecondarySort("name")}
                                        />
                                    </TableHead>
                                    <TableHead className="text-xs uppercase tracking-wide text-gray-500">
                                        <SortButton
                                            label="Stock"
                                            active
                                            dir={stockSortDir}
                                            onClick={toggleStockSort}
                                        />
                                    </TableHead>
                                    <TableHead className="text-right text-xs uppercase tracking-wide text-gray-500">
                                        <SortButton
                                            label="Precio compra"
                                            active={secondarySort?.key === "cost"}
                                            dir={secondarySort?.key === "cost" ? secondarySort.dir : "asc"}
                                            onClick={() => toggleSecondarySort("cost")}
                                            align="right"
                                        />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageProducts.map((p) => {
                                    const critical = (p.stock ?? 0) <= CRITICAL_STOCK_MAX
                                    return (
                                        <TableRow key={p.id} className={cn(critical && "bg-red-50/40 hover:bg-red-50/70")}>
                                            <TableCell className="py-3 text-sm text-gray-600 tabular-nums">
                                                {p.barcode || "—"}
                                            </TableCell>
                                            <TableCell className="max-w-md whitespace-normal py-3 text-base">
                                                <Link
                                                    href={`/producto?id=${p.id}`}
                                                    className="font-medium text-gray-900 hover:text-[#3b82f6] hover:underline"
                                                >
                                                    {p.name}
                                                </Link>
                                                <div className="mt-1">
                                                    <Badge variant="outline" className="text-sm font-normal text-gray-600">
                                                        {p.category}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <Badge variant={stockBadgeVariant(p.stock ?? 0)} className="text-sm tabular-nums">
                                                    {critical && <AlertTriangle className="h-3 w-3" />}
                                                    {p.stock}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3 text-right text-base tabular-nums">
                                                ${(p.costPrice ?? 0).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                            <PackageSearch className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500">No hay productos con stock bajo en esta categoría.</p>
                        </div>
                    )}

                    {!loading && hasResults && (
                        <div className="border-t border-gray-200/60 px-5 py-4">
                            <CatalogPagination
                                currentPage={safePage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
