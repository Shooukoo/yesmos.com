"use client"

import Link from "next/link"
import { ProductCard } from "@/components/catalog/product-card"
import type { Product } from "@/lib/products-cache"

export function RelatedProducts({ products }: { products: Product[] }) {
    if (products.length === 0) return null

    return (
        <section className="mt-14 border-t border-gray-100 pt-10">
            <div className="flex items-end justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                    Productos relacionados
                </h2>
                <Link
                    href="/#catalogo"
                    className="text-sm font-medium text-[#3b82f6] hover:underline"
                >
                    Ver catálogo
                </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}
