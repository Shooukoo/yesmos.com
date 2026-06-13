import type { Product } from "@/lib/products-cache"

interface DeviceInfo {
    signatures: string[]
    brands: string[]
}

// Alias del proveedor → marca normalizada
const BRAND_ALIASES: Record<string, string> = {
    SAM: "SAMSUNG",
    SAMSUNG: "SAMSUNG",
    IP: "IPHONE",
    IPH: "IPHONE",
    IPHONE: "IPHONE",
    MOTO: "MOTOROLA",
    MOT: "MOTOROLA",
    MOTOROLA: "MOTOROLA",
    HW: "HUAWEI",
    HUAWEI: "HUAWEI",
    OPPO: "OPPO",
    REDMI: "REDMI",
    XIAOMI: "XIAOMI",
    POCO: "POCO",
    VIVO: "VIVO",
    HONOR: "HONOR",
    ZTE: "ZTE",
    LG: "LG",
    NOKIA: "NOKIA",
    REALME: "REALME",
    ALCATEL: "ALCATEL",
    HISENSE: "HISENSE",
    LANIX: "LANIX",
    TCL: "TCL",
}

// Palabras de categoría (ver categorize() en app/api/refacciones/route.ts) y
// modificadores/colores que no identifican al equipo
const NOISE = new Set([
    "DIS", "LCD", "PANTALLA", "BAT", "PILA", "TAPA", "TRASERA", "FLEX",
    "CENTRO", "CARGA", "TOUCH", "LENTE", "CAMARA", "CAMARAS", "SIM", "RSIM",
    "BANDEJA", "ACCESORIO", "CABLE", "FUNDA", "ALTAVOZ", "ENCENDIDO",
    "VOLUMEN", "CONECTOR", "INTERCON", "CC",
    // Calidad/variante de panel: no identifican el equipo ("DIS IP 12 MINI
    // INCELL FHD" debe empatar con "SIM IP 12 MINI")
    "ORI", "ORIGINAL", "INCELL", "OLED", "AMOLED", "FHD", "HD", "HD+",
    "SOFT", "120HZ", "TM", "CAL.", "CAL", "FULL", "SIZE", "VER",
    "CON", "IC", "C", "M",
    "S", "Y", "DE", "P", "NEW", "TIPO", "PINES", "YESMOS",
    // Conectividad: "A15 4G/5G" son variantes del mismo equipo, y dividir por
    // "/" dejaría una firma suelta "5G" que empata con cualquier modelo 5G
    "4G", "5G",
    "NEGRO", "NEGRA", "BLANCO", "BLANCA", "AZUL", "ROJO", "ROJA", "VERDE",
    "GRIS", "DORADO", "DORADA", "MORADO", "MORADA", "ROSA", "VIOLETA",
    "AMARILLO", "AMARILLA", "ORO",
])

export function parseDeviceInfo(name: string): DeviceInfo {
    const clean = name
        .toUpperCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        // Ruido con slash que no separa modelos: C/C, C/M, S/M, P/IPHONE...
        .replace(/\b[CSP]\/[CM]?\b/g, " ")
        .replace(/[()]/g, " ")

    const brands = new Set<string>()
    const signatures: string[] = []

    for (const segment of clean.split("/")) {
        const modelTokens: string[] = []
        for (const token of segment.split(/\s+/)) {
            if (!token) continue
            const brand = BRAND_ALIASES[token]
            if (brand) {
                brands.add(brand)
            } else if (!NOISE.has(token)) {
                modelTokens.push(token)
            }
        }
        if (modelTokens.length > 0) signatures.push(modelTokens.join(" "))
    }

    if (brands.size === 0) {
        // Números de parte de batería Oppo (BLP817...) aparecen sin marca
        if (signatures.some((s) => s.split(" ").some((t) => t.startsWith("BLP")))) {
            brands.add("OPPO")
        } else if (signatures.some((s) => /^[AJS]\d{2}/.test(s))) {
            // El proveedor omite la marca en modelos Samsung (A12, J7, S20...);
            // los modelos A/J/S de otras marcas traen marca o parte BLP
            brands.add("SAMSUNG")
        }
    }

    return { signatures, brands: [...brands] }
}

function sameDevice(a: DeviceInfo, b: DeviceInfo): boolean {
    const brandsCompatible =
        a.brands.length === 0 ||
        b.brands.length === 0 ||
        a.brands.some((brand) => b.brands.includes(brand))
    return brandsCompatible && a.signatures.some((sig) => b.signatures.includes(sig))
}

function sameBrand(a: DeviceInfo, b: DeviceInfo): boolean {
    return a.brands.some((brand) => b.brands.includes(brand))
}

export function getRelatedProducts(
    product: Product,
    allProducts: Product[],
    limit = 4,
): Product[] {
    const current = parseDeviceInfo(product.name)

    return allProducts
        .filter((p) => p.id !== product.id)
        .map((p) => {
            const info = parseDeviceInfo(p.name)
            const device = sameDevice(current, info)
            const category = p.category === product.category

            let score = 0
            if (device && !category) score = 300
            else if (category && device) score = 200
            else if (category && sameBrand(current, info)) score = 100
            else if (category) score = 1

            return { product: p, score: score === 0 ? 0 : score + (p.available ? 50 : 0) }
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.product.id - b.product.id)
        .slice(0, limit)
        .map((entry) => entry.product)
}
