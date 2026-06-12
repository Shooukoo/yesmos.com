import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/products-cache"

export function ProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={`/producto?id=${product.id}`}
            className={`group flex flex-col ${product.available ? "" : "opacity-60 grayscale"}`}
        >
            <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                <span
                    className={`absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${
                        product.available ? "text-green-700" : "text-gray-500"
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${product.available ? "bg-green-500" : "bg-gray-400"}`}
                    ></span>
                    {product.available
                        ? `En stock${product.stock !== undefined ? ` (${product.stock})` : ""}`
                        : "Agotado"}
                </span>

                <Image
                    src={product.image && product.image.startsWith("http") ? product.image : "https://placehold.co/400x400?text=Sin+Imagen"}
                    alt={product.name}
                    fill
                    className="object-contain p-4 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                />

                <span className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-white/90 py-2.5 text-center text-xs font-medium text-[#3b82f6] backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 md:block">
                    Ver detalles
                </span>
            </div>

            <div className="mt-3 space-y-1">
                <h3 className="line-clamp-2 text-sm font-normal text-gray-700" title={product.name}>
                    {product.name}
                </h3>
                <p className={`text-sm font-semibold ${product.available ? "text-gray-900" : "text-gray-400"}`}>
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </Link>
    )
}
