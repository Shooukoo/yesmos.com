"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import dynamic from 'next/dynamic'
import {
    Search,
    Package,
    ScanBarcode,
    Loader2,
    PlusCircle,
    ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { cn } from "@/lib/utils"


// Importamos los tipos desde el archivo que creamos en el paso 1
import type { CartItem, CompanyData, ProductBase, ProductWithPrice } from "./TicketSidebar"

// Carga el código del Ticket SOLO cuando se necesita. Esto ahorra mucho peso inicial.
const TicketSidebar = dynamic(() => import('./TicketSidebar').then(mod => mod.TicketSidebar), {
    loading: () => <div className="w-full h-full bg-gray-50 animate-pulse flex items-center justify-center"><Loader2 className="animate-spin text-gray-300" /></div>,
    ssr: false
})

const PrintableTicket = dynamic(() => import('./TicketSidebar').then(mod => mod.PrintableTicket), {
    ssr: false
})

// --- CONSTANTES ---
const ITEMS_PER_PAGE = 15;
const STORAGE_KEY = "YESMOS_POS_V1";

// Función de normalización
const normalizeText = (text: string) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

// --- MOTOR DE PRECIOS ---
function calculateSellingPrice(precioOriginal: number, categoria: string, nombreProducto: string) {
    const nombre = nombreProducto.toLowerCase()
    const cat = categoria.trim().toUpperCase()

    // A. EXCEPCIONES: TAPAS
    if (cat === "TAPAS") {
        const precioFinal = nombre.includes("iphone") || nombre.includes("ip") ? 900 : 550
        return { sellingPrice: precioFinal }
    }

    // B. EXCEPCIONES: CATEGORÍAS CON PRECIOS FIJOS
    const categoriasFijas: Record<string, number> = {
        "BANDEJAS SIM": 350,
        LENTES: 350,
        "CENTRO DE CARGA": 350,
        "FLEX DE CARGA": 550,
    }

    if (categoriasFijas[cat]) {
        return { sellingPrice: categoriasFijas[cat] }
    }

    // C. EXCEPCIÓN: BATERÍAS
    if (cat === "BATERIAS" || cat === "BATERIA" || nombre.includes("bat")) {
        if (nombre.includes("iphone") || nombre.includes("ip")) {
            const precioDoble = precioOriginal * 2
            return { sellingPrice: Math.ceil(precioDoble / 50) * 50 }
        }
        const precioDoble = precioOriginal * 2
        const precioBase = Math.ceil(precioDoble / 50) * 50
        return { sellingPrice: Math.max(450, precioBase + 100) }
    }

    // D. REGLA GENERAL: x2 y redondear al siguiente múltiplo de 50 o 100 según el residuo
    const precioDoble = precioOriginal * 2
    const residuo = precioDoble % 100

    let precioFinal: number

    // Si el residuo es 50 o menos, redondeamos a 50
    if (residuo <= 50) {
        precioFinal = precioDoble - residuo + 50
    } else {
        // Si el residuo es mayor a 50, redondeamos a la siguiente centena
        precioFinal = precioDoble - residuo + 100
    }

    return { sellingPrice: precioFinal }
}

// --- TARJETA DE PRODUCTO ---
const ProductCard = ({ product, onAdd }: { product: ProductWithPrice; onAdd: (p: ProductWithPrice) => void }) => {
    return (
        <div onClick={() => onAdd(product)} className="group relative flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="relative h-36 sm:h-40 bg-gradient-to-br from-gray-50 to-white p-3 flex items-center justify-center overflow-hidden">
                <Image
                    src={product.image && product.image.startsWith("http") ? product.image : "https://placehold.co/400x400?text=Sin+Imagen"}
                    alt={product.name}
                    fill
                    className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out p-2"
                    // OPTIMIZACIÓN DE IMAGEN: Fundamental para el score de rendimiento
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">{product.category}</span>
            </div>
            <div className="p-3 flex flex-col gap-2 flex-1 justify-between border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.5em]" title={product.name}>{product.name}</h3>
                <div className="flex items-baseline gap-2"><span className="text-lg sm:text-xl font-black text-gray-900">${product.sellingPrice}</span></div>
                <Button className="w-full bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white font-bold h-8 sm:h-9 text-xs sm:text-sm border border-blue-200 hover:border-transparent transition-all duration-200" size="sm">
                    <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Agregar
                </Button>
            </div>
        </div>
    )
}

// --- COMPONENTE PRINCIPAL ---
export default function CotizadorPage() {
    const [products, setProducts] = useState<ProductWithPrice[]>([])
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState<CartItem[]>([])
    const [clientName, setClientName] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [laborCost, setLaborCost] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Todos")

    const [isInitialized, setIsInitialized] = useState(false)
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
    const [companyData, setCompanyData] = useState<CompanyData>({ name: "", address: "", phone: "", repairer: "", logo: null })
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Carga de LocalStorage
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) { try { const parsed = JSON.parse(savedState); if (parsed.cart) setCart(parsed.cart); if (parsed.clientName) setClientName(parsed.clientName); if (parsed.clientPhone) setClientPhone(parsed.clientPhone); if (parsed.laborCost) setLaborCost(parsed.laborCost); if (parsed.companyData) setCompanyData(parsed.companyData); } catch (e) { console.error("Error al leer LocalStorage", e); } }
        setIsInitialized(true);
    }, []);

    // Guardado en LocalStorage
    useEffect(() => { if (isInitialized) { const stateToSave = { cart, clientName, clientPhone, laborCost, companyData }; localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave)); } }, [cart, clientName, clientPhone, laborCost, companyData, isInitialized]);

    // Fetch de datos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = process.env.NODE_ENV === "development" ? "/api/refacciones" : "/api/refacciones.php"
                const response = await fetch(apiUrl)
                let data: ProductBase[] = []
                if (response.ok) { data = await response.json() }
                const processedProducts = Array.isArray(data) ? data.map((p) => { const pricing = calculateSellingPrice(p.price, p.category, p.name); return { ...p, sellingPrice: pricing.sellingPrice } }) : []
                setProducts(processedProducts)
            } catch (error) { console.error("Error cargando cotizador:", error); toast.error("Error al cargar productos") } finally { setLoading(false) }
        }
        fetchProducts()
    }, [])

    useEffect(() => { setVisibleCount(ITEMS_PER_PAGE) }, [searchQuery, selectedCategory])

    const addToCart = (product: ProductWithPrice) => { const newItem: CartItem = { ...product, cartId: crypto.randomUUID() }; setCart((prev) => [...prev, newItem]); toast.success("Agregado al ticket", { duration: 1500, position: "bottom-center", icon: <Package className="h-4 w-4" /> }) }
    const removeFromCart = (cartId: string) => { setCart((prev) => prev.filter((item) => item.cartId !== cartId)); toast.info("Producto eliminado", { duration: 1000, position: "bottom-center" }) }
    const clearCart = () => { setCart([]); setLaborCost(""); setClientName(""); setClientPhone(""); toast.info("Ticket vaciado", { duration: 1000, position: "bottom-center" }) }
    const updateItemPrice = (cartId: string, newPrice: number) => { setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, sellingPrice: newPrice } : item))) }

    const totals = useMemo(() => { const subtotal = cart.reduce((acc, item) => acc + item.sellingPrice, 0); const labor = Number(laborCost) || 0; const total = subtotal + labor; return { subtotal, labor, total } }, [cart, laborCost])
    const categories = useMemo(() => ["Todos", ...Array.from(new Set(products.map((p) => p.category))).sort()], [products])

    // Filtrado Inteligente
    const filteredProducts = useMemo(() => {
        const cleanQuery = normalizeText(searchQuery)
        const queryTerms = cleanQuery.split(" ").filter(Boolean)
        return products.filter((p) => {
            const matchCat = selectedCategory === "Todos" || p.category === selectedCategory
            if (!matchCat) return false
            if (queryTerms.length === 0) return true
            const cleanName = normalizeText(p.name)
            return queryTerms.every((term) => cleanName.includes(term))
        })
    }, [products, searchQuery, selectedCategory])

    const displayedProducts = useMemo(() => { return filteredProducts.slice(0, visibleCount) }, [filteredProducts, visibleCount])
    const handleLoadMore = () => { setVisibleCount((prev) => prev + ITEMS_PER_PAGE) }

    const handleSendWhatsApp = () => {
        if (!clientPhone) { toast.error("Agrega un teléfono del cliente"); return }
        if (cart.length === 0) { toast.error("El ticket está vacío"); return }
        const cleanPhone = clientPhone.replace(/\D/g, ""); const finalPhone = cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone;
        let message = `Hola${clientName ? " " + clientName : ""}!\n\n`; if (companyData.name) { message += `Tu cotizacion de *${companyData.name}*:\n\n` } else { message += `Tu cotizacion:\n\n` }
        cart.forEach((item) => { message += `- ${item.name}: $${item.sellingPrice}\n` }); if (totals.labor > 0) { message += `\nMano de obra: $${totals.labor}\n` }
        message += `\n--------------------\n`; message += `*TOTAL: $${totals.total}*\n`; if (companyData.name || companyData.address || companyData.phone) { message += `\n`; if (companyData.name || companyData.address) { message += `${[companyData.name, companyData.address].filter(Boolean).join(" - ")}\n` } if (companyData.phone) { message += `Tel: ${companyData.phone}` } }
        message += `\n\nEsta cotización puede tener cambios, por favor contacte al taller de reparación ${companyData.name || ""}`; window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, "_blank"); toast.success("Abriendo WhatsApp...")
    }

    const handlePrint = () => { if (cart.length === 0) { toast.error("El ticket está vacío"); return } const originalTitle = document.title; document.title = companyData.name ? `Cotización - ${companyData.name}` : "Cotización"; window.print(); setTimeout(() => { document.title = originalTitle }, 1000) }
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { if (file.size > 2 * 1024 * 1024) { toast.error("El archivo es muy grande (máx. 2MB)"); return } const reader = new FileReader(); reader.onloadend = () => { setCompanyData((prev) => ({ ...prev, logo: reader.result as string })); toast.success("Logo cargado") }; reader.readAsDataURL(file) } }

    return (
        <>
            <style jsx global>{` @media print { @page { margin: 20mm; margin-top: 10mm; margin-bottom: 10mm; } body > *:not(#print-area-wrapper) { display: none !important; } #print-area-wrapper { display: block !important; position: absolute; top: 0; left: 0; width: 100%; height: auto; background: white; z-index: 9999; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } } `}</style>

            {/* Wrapper de Impresión (Cargado dinámicamente) */}
            <div id="print-area-wrapper" className="hidden">
                <PrintableTicket cart={cart} totals={totals} clientName={clientName} clientPhone={clientPhone} companyData={companyData} />
            </div>

            <div className="h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50/30 flex flex-col md:flex-row overflow-hidden print:hidden">
                <div className="flex-1 flex flex-col h-full min-w-0">
                    <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-4 border-b border-gray-200/60 z-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2"><div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/20"><Package className="h-5 w-5 text-white" /></div><div className="hidden sm:block"><h1 className="font-black text-lg text-gray-900 leading-none">YESMOS</h1><p className="text-[10px] text-gray-500 uppercase tracking-wider">Cotizador</p></div></div>
                            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Buscar producto..." className="pl-10 bg-gray-50/80 border-gray-200 focus-visible:ring-blue-500 rounded-xl h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                        </div>
                        <ScrollArea className="w-full whitespace-nowrap pb-1"><div className="flex gap-2">{categories.map((cat) => (<Badge key={cat} variant={selectedCategory === cat ? "default" : "outline"} className={cn("cursor-pointer px-4 py-1.5 rounded-full transition-all border text-xs font-semibold shrink-0", selectedCategory === cat ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-md shadow-blue-500/20" : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300")} onClick={() => setSelectedCategory(cat)}>{cat}</Badge>))}</div></ScrollArea>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        {loading ? (<div className="flex h-full items-center justify-center"><div className="text-center space-y-3"><Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto" /><p className="text-sm text-gray-500">Cargando catálogo...</p></div></div>) : filteredProducts.length === 0 ? (<div className="flex h-full items-center justify-center"><div className="text-center space-y-3"><Package className="h-12 w-12 text-gray-300 mx-auto" /><p className="text-gray-500">No se encontraron productos</p><Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("Todos") }}>Limpiar filtros</Button></div></div>) : (<><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 pb-6">{displayedProducts.map((product) => (<ProductCard key={product.id} product={product} onAdd={addToCart} />))}</div>{visibleCount < filteredProducts.length && (<div className="flex justify-center pb-24 md:pb-12"><Button onClick={handleLoadMore} variant="outline" className="min-w-[200px] rounded-full border-blue-200 text-blue-600 bg-white hover:bg-blue-50 font-bold shadow-sm h-12"><ChevronDown className="mr-2 h-4 w-4" /> Cargar más productos</Button></div>)}</>)}
                    </div>
                </div>

                {/* SIDEBAR DESKTOP (CARGA DINÁMICA) */}
                <div className="hidden md:block w-[380px] h-full shrink-0 relative z-20">
                    <TicketSidebar cart={cart} totals={totals} clientName={clientName} setClientName={setClientName} clientPhone={clientPhone} setClientPhone={setClientPhone} laborCost={laborCost} setLaborCost={setLaborCost} onRemove={removeFromCart} onClear={clearCart} onPrint={handlePrint} onSend={handleSendWhatsApp} onUpdatePrice={updateItemPrice} companyData={companyData} setCompanyData={setCompanyData} onLogoUpload={handleLogoUpload} fileInputRef={fileInputRef} />
                </div>

                {/* SIDEBAR MÓVIL (CARGA DINÁMICA) */}
                <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 flex justify-between items-center shadow-2xl shadow-gray-300/50">
                    <div className="flex flex-col"><span className="text-[10px] uppercase tracking-wider text-gray-500">Total</span><span className="text-2xl font-black text-gray-900">${totals.total}</span></div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 h-12 shadow-xl shadow-blue-500/30 font-bold">
                                <ScanBarcode className="mr-2 h-5 w-5" /> Ver Ticket {cart.length > 0 && (<Badge className="ml-2 bg-white/20 text-white border-none text-xs">{cart.length}</Badge>)}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[92vh] rounded-t-[2rem] p-0 overflow-hidden border-0">
                            {/* El componente TicketSidebar solo se descarga al abrir este Sheet */}
                            <TicketSidebar cart={cart} totals={totals} clientName={clientName} setClientName={setClientName} clientPhone={clientPhone} setClientPhone={setClientPhone} laborCost={laborCost} setLaborCost={setLaborCost} onRemove={removeFromCart} onClear={clearCart} onPrint={handlePrint} onSend={handleSendWhatsApp} onUpdatePrice={updateItemPrice} companyData={companyData} setCompanyData={setCompanyData} onLogoUpload={handleLogoUpload} fileInputRef={fileInputRef} />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    )
}