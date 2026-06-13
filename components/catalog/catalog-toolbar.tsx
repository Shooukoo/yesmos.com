"use client"

import { SlidersHorizontal, Grid3x3, LayoutGrid } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type SortOption = "relevance" | "price-asc" | "price-desc" | "name-asc"
export type AvailabilityFilter = "all" | "in-stock"
export type GridDensity = 3 | 4

interface CatalogToolbarProps {
    categories: string[]
    category: string
    onCategoryChange: (value: string) => void
    availability: AvailabilityFilter
    onAvailabilityChange: (value: AvailabilityFilter) => void
    sort: SortOption
    onSortChange: (value: SortOption) => void
    density: GridDensity
    onDensityChange: (value: GridDensity) => void
    resultCount: number
}

const labelClass = "text-[11px] font-medium uppercase tracking-wide text-gray-500"
const triggerClass =
    "h-11 w-full bg-white focus-visible:border-[#3b82f6] focus-visible:ring-[#3b82f6]/30 data-[size=default]:h-11"

export function CatalogToolbar({
    categories,
    category,
    onCategoryChange,
    availability,
    onAvailabilityChange,
    sort,
    onSortChange,
    density,
    onDensityChange,
    resultCount,
}: CatalogToolbarProps) {
    return (
        <div className="mb-8 border-y border-gray-200 py-4">
            {/* Encabezado de la barra (solo móvil, da contexto a los selects) */}
            <div className="mb-3 flex items-center justify-between sm:hidden">
                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                    <SlidersHorizontal className="h-4 w-4" /> Filtrar y ordenar
                </span>
                <span className="text-sm text-gray-500">{resultCount} productos</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
                <div className="flex min-w-0 flex-col gap-1.5">
                    <Label htmlFor="filtro-categoria" className={labelClass}>
                        Categoría
                    </Label>
                    <Select value={category} onValueChange={onCategoryChange}>
                        <SelectTrigger id="filtro-categoria" className={`${triggerClass} sm:w-[170px]`}>
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex min-w-0 flex-col gap-1.5">
                    <Label htmlFor="filtro-disponibilidad" className={labelClass}>
                        Disponibilidad
                    </Label>
                    <Select
                        value={availability}
                        onValueChange={(v) => onAvailabilityChange(v as AvailabilityFilter)}
                    >
                        <SelectTrigger id="filtro-disponibilidad" className={`${triggerClass} sm:w-[160px]`}>
                            <SelectValue placeholder="Disponibilidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="in-stock">En existencia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-2 flex items-end gap-3 sm:col-span-1 sm:ml-auto">
                    <span className="mb-3 hidden whitespace-nowrap text-sm text-gray-500 md:inline">
                        {resultCount} productos
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-none">
                        <Label htmlFor="filtro-orden" className={labelClass}>
                            Ordenar por
                        </Label>
                        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
                            <SelectTrigger id="filtro-orden" className={`${triggerClass} sm:w-[180px]`}>
                                <SelectValue placeholder="Ordenar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="relevance">Relevancia</SelectItem>
                                <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                                <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                                <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ToggleGroup
                        type="single"
                        variant="outline"
                        className="hidden lg:flex"
                        value={String(density)}
                        onValueChange={(v) => v && onDensityChange(Number(v) as GridDensity)}
                    >
                        <ToggleGroupItem
                            value="3"
                            aria-label="Cuadrícula de 3 columnas"
                            className="h-11 w-11 data-[state=on]:bg-blue-50 data-[state=on]:text-[#3b82f6]"
                        >
                            <Grid3x3 className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="4"
                            aria-label="Cuadrícula de 4 columnas"
                            className="h-11 w-11 data-[state=on]:bg-blue-50 data-[state=on]:text-[#3b82f6]"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
        </div>
    )
}
