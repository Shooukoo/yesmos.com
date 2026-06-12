"use client"

import { SlidersHorizontal, Grid3x3, LayoutGrid } from "lucide-react"
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
        <div className="mb-8 flex flex-wrap items-center gap-3 border-y border-gray-200 py-3">
            <span className="hidden items-center gap-1.5 text-sm font-medium text-gray-900 sm:flex">
                <SlidersHorizontal className="h-4 w-4" /> Filtrar:
            </span>

            <Select value={category} onValueChange={onCategoryChange}>
                <SelectTrigger
                    className="h-11 w-[46%] bg-white focus-visible:border-[#3b82f6] focus-visible:ring-[#3b82f6]/30 data-[size=default]:h-11 sm:w-[170px]"
                    aria-label="Filtrar por categoría"
                >
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

            <Select
                value={availability}
                onValueChange={(v) => onAvailabilityChange(v as AvailabilityFilter)}
            >
                <SelectTrigger
                    className="h-11 w-[46%] bg-white focus-visible:border-[#3b82f6] focus-visible:ring-[#3b82f6]/30 data-[size=default]:h-11 sm:w-[160px]"
                    aria-label="Filtrar por disponibilidad"
                >
                    <SelectValue placeholder="Disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="in-stock">En existencia</SelectItem>
                </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-3">
                <span className="hidden text-sm text-gray-500 md:inline">
                    {resultCount} productos
                </span>

                <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
                    <SelectTrigger
                        className="h-11 w-[180px] bg-white focus-visible:border-[#3b82f6] focus-visible:ring-[#3b82f6]/30 data-[size=default]:h-11"
                        aria-label="Ordenar productos"
                    >
                        <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="relevance">Relevancia</SelectItem>
                        <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                        <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                        <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                    </SelectContent>
                </Select>

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
    )
}
