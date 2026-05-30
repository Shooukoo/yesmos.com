export interface Product {
    id: number
    barcode?: string
    name: string
    price: number
    category: string
    image: string
    url: string
    available: boolean
    stock?: number
}

// Caché en memoria compartida entre todos los componentes cliente.
// Persiste durante toda la sesión del navegador (mientras el bundle esté cargado).
let cache: Product[] | null = null
let cacheTime = 0
const TTL_MS = 5 * 60 * 1000 // 5 minutos

export async function getProducts(): Promise<Product[]> {
    if (cache && Date.now() - cacheTime < TTL_MS) {
        return cache
    }

    const apiUrl =
        process.env.NODE_ENV === "development"
            ? "/api/refacciones"
            : "/api/refacciones.php"

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error("Error al cargar el catálogo")

    const data: Product[] = await res.json()
    cache = data
    cacheTime = Date.now()
    return data
}

export function clearProductsCache() {
    cache = null
    cacheTime = 0
}
