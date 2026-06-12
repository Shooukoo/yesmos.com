"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination"

interface CatalogPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

function getPageRange(current: number, total: number): (number | "...")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages: (number | "...")[] = [1]

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    if (start > 2) pages.push("...")
    for (let page = start; page <= end; page++) pages.push(page)
    if (end < total - 1) pages.push("...")

    pages.push(total)
    return pages
}

export function CatalogPagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: CatalogPaginationProps) {
    if (totalPages <= 1) return null

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <button
                        type="button"
                        aria-label="Página anterior"
                        disabled={currentPage <= 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-11 w-11 disabled:pointer-events-none disabled:opacity-40",
                        )}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </PaginationItem>

                {getPageRange(currentPage, totalPages).map((page, index) =>
                    page === "..." ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <button
                                type="button"
                                aria-label={`Página ${page}`}
                                aria-current={page === currentPage ? "page" : undefined}
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    buttonVariants({
                                        variant: page === currentPage ? "default" : "ghost",
                                        size: "icon",
                                    }),
                                    "h-11 w-11",
                                    page === currentPage &&
                                        "bg-[#3b82f6] text-white hover:bg-[#2563eb]",
                                )}
                            >
                                {page}
                            </button>
                        </PaginationItem>
                    ),
                )}

                <PaginationItem>
                    <button
                        type="button"
                        aria-label="Página siguiente"
                        disabled={currentPage >= totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-11 w-11 disabled:pointer-events-none disabled:opacity-40",
                        )}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
