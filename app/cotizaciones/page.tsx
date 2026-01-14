"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import {
    Search,
    ShoppingCart,
    Trash2,
    Printer,
    MessageCircle,
    User,
    Phone,
    Package,
    ScanBarcode,
    Loader2,
    PlusCircle,
    Wrench,
    Upload,
    LinkIcon,
    X,
    ChevronDown,
    Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// --- CONSTANTES ---
const ITEMS_PER_PAGE = 15; // Cantidad de productos a cargar por bloque
const STORAGE_KEY = "YESMOS_POS_V1"; // Clave para guardar en el navegador

// --- TIPOS ---
interface ProductBase {
    id: number
    name: string
    price: number
    category: string
    image: string
    url: string
    available: boolean
}

interface ProductWithPrice extends ProductBase {
    sellingPrice: number
}

interface CartItem extends ProductWithPrice {
    cartId: string
}

interface CompanyData {
    name: string
    address: string
    phone: string
    repairer: string
    logo: string | null
}

interface TicketProps {
    cart: CartItem[]
    totals: { subtotal: number; labor: number; total: number }
    clientName: string
    setClientName: (v: string) => void
    clientPhone: string
    setClientPhone: (v: string) => void
    laborCost: string
    setLaborCost: (v: string) => void
    onRemove: (id: string) => void
    onClear: () => void
    onPrint: () => void
    onSend: () => void
    onUpdatePrice: (cartId: string, newPrice: number) => void
    companyData: CompanyData
    setCompanyData: (data: CompanyData) => void
    onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    fileInputRef: React.RefObject<HTMLInputElement | null>
}

interface PrintableTicketProps {
    cart: CartItem[]
    totals: { subtotal: number; labor: number; total: number }
    clientName: string
    clientPhone: string
    companyData: CompanyData
}

// --- MOTOR DE PRECIOS (LÓGICA DE NEGOCIO CRÍTICA) ---
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
            const precioFinal = Math.ceil(precioDoble / 50) * 50
            return { sellingPrice: precioFinal }
        }
        const precioDoble = precioOriginal * 2
        const precioBase = Math.ceil(precioDoble / 50) * 50
        const precioFinal = Math.max(450, precioBase + 100)
        return { sellingPrice: precioFinal }
    }

    // D. REGLA GENERAL: x2 y redondear al siguiente múltiplo de 50
    const precioDoble = precioOriginal * 2
    const precioFinal = Math.ceil(precioDoble / 50) * 50

    return { sellingPrice: precioFinal }
}

// --- TARJETA DE PRODUCTO (Sin descuentos) ---
const ProductCard = ({ product, onAdd }: { product: ProductWithPrice; onAdd: (p: ProductWithPrice) => void }) => {
    return (
        <div
            onClick={() => onAdd(product)}
            className="group relative flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Imagen con efecto zoom */}
            <div className="relative h-36 sm:h-40 bg-gradient-to-br from-gray-50 to-white p-3 flex items-center justify-center overflow-hidden">
                <Image
                    // FIX: Usar placeholder online si la imagen no es válida o local
                    src={product.image && product.image.startsWith("http") ? product.image : "https://placehold.co/400x400?text=Sin+Imagen"}
                    alt={product.name}
                    fill
                    className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out p-2"
                    sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Badge Categoría */}
                <span className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                    {product.category}
                </span>
            </div>

            {/* Info y Botón */}
            <div className="p-3 flex flex-col gap-2 flex-1 justify-between border-t border-gray-100">
                <h3
                    className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.5em]"
                    title={product.name}
                >
                    {product.name}
                </h3>

                <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-black text-gray-900">${product.sellingPrice}</span>
                </div>

                {/* Botón Agregar */}
                <Button
                    className="w-full bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white font-bold h-8 sm:h-9 text-xs sm:text-sm border border-blue-200 hover:border-transparent transition-all duration-200"
                    size="sm"
                >
                    <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                    Agregar
                </Button>
            </div>
        </div>
    )
}

// --- SIDEBAR TICKET (Con edición de empresa inline) ---
const TicketSidebar = ({
    cart,
    totals,
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    laborCost,
    setLaborCost,
    onRemove,
    onClear,
    onPrint,
    onSend,
    onUpdatePrice,
    companyData,
    setCompanyData,
    onLogoUpload,
    fileInputRef,
}: TicketProps) => {
    const [isCompanyOpen, setIsCompanyOpen] = useState(false)
    const [logoUrlInput, setLogoUrlInput] = useState("")

    const handleLogoUrl = () => {
        if (logoUrlInput.trim()) {
            setCompanyData({ ...companyData, logo: logoUrlInput.trim() })
            toast.success("Logo cargado desde URL")
        }
    }

    const handleRemoveLogo = () => {
        setCompanyData({ ...companyData, logo: null })
        setLogoUrlInput("")
    }

    return (
        <div className="grid grid-rows-[auto_1fr_auto] h-full bg-white border-l border-gray-200 shadow-2xl shadow-gray-300/30">
            {/* Header con degradado oscuro */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                            <ScanBarcode className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-none tracking-tight">Ticket</h2>
                            <p className="text-[11px] text-blue-300/80 mt-0.5">Yesmos POS</p>
                        </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30">
                        {cart.length} {cart.length === 1 ? "Ítem" : "Ítems"}
                    </Badge>
                </div>

                {/* Inputs de Cliente y Mano de Obra */}
                <div className="space-y-2.5">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Nombre del Cliente"
                            className="pl-9 bg-white text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-10 font-medium rounded-xl"
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="WhatsApp (10 dígitos)"
                            type="tel"
                            className="pl-9 bg-white text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-10 font-medium rounded-xl"
                        />
                    </div>
                    <div className="relative">
                        <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Input
                            value={laborCost}
                            onChange={(e) => setLaborCost(e.target.value)}
                            placeholder="Mano de obra (opcional)"
                            type="number"
                            min="0"
                            className="pl-9 bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-amber-400 h-10 font-medium rounded-xl"
                        />
                    </div>
                </div>

                <Collapsible open={isCompanyOpen} onOpenChange={setIsCompanyOpen} className="mt-3">
                    <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm">
                            <span className="flex items-center gap-2 text-white/80">
                                <Settings className="h-4 w-4" />
                                Datos de mi empresa
                            </span>
                            <ChevronDown
                                className={cn("h-4 w-4 text-white/60 transition-transform", isCompanyOpen && "rotate-180")}
                            />
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                        <Input
                            value={companyData.name}
                            onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                            placeholder="Nombre de la empresa"
                            className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-9 text-sm rounded-lg"
                        />
                        <Input
                            value={companyData.address}
                            onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                            placeholder="Dirección"
                            className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-9 text-sm rounded-lg"
                        />
                        <Input
                            value={companyData.phone}
                            onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                            placeholder="Teléfono de la empresa"
                            className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-9 text-sm rounded-lg"
                        />
                        <Input
                            value={companyData.repairer}
                            onChange={(e) => setCompanyData({ ...companyData, repairer: e.target.value })}
                            placeholder="Nombre del reparador"
                            className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-9 text-sm rounded-lg"
                        />

                        {/* Logo */}
                        <div className="pt-1">
                            <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1.5">Logo (opcional)</p>
                            {companyData.logo ? (
                                <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                                    <img
                                        src={companyData.logo || "/placeholder.svg"}
                                        alt="Logo"
                                        className="h-10 w-10 object-contain rounded"
                                    />
                                    <span className="text-xs text-white/70 flex-1">Logo cargado</span>
                                    <button onClick={handleRemoveLogo} className="text-red-400 hover:text-red-300 p-1" title="Eliminar logo">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <Tabs defaultValue="upload" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 h-8 bg-white/10">
                                        <TabsTrigger
                                            value="upload"
                                            className="text-[10px] text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                                        >
                                            <Upload className="h-3 w-3 mr-1" />
                                            Subir
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="url"
                                            className="text-[10px] text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                                        >
                                            <LinkIcon className="h-3 w-3 mr-1" />
                                            URL
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upload" className="mt-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={onLogoUpload}
                                            accept="image/*"
                                            className="hidden"
                                            title="Subir imagen del logo"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-12 border-dashed border-white/30 bg-transparent hover:bg-white/10 text-white/70"
                                        >
                                            <div className="flex flex-col items-center gap-0.5">
                                                <Upload className="h-4 w-4" />
                                                <span className="text-[10px]">Click para subir (máx. 2MB)</span>
                                            </div>
                                        </Button>
                                    </TabsContent>
                                    <TabsContent value="url" className="mt-2 space-y-1.5">
                                        <Input
                                            value={logoUrlInput}
                                            onChange={(e) => setLogoUrlInput(e.target.value)}
                                            placeholder="https://ejemplo.com/logo.png"
                                            className="bg-white/90 text-gray-900 border-0 h-8 text-xs"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={handleLogoUrl}
                                            className="w-full h-8 text-xs bg-transparent border-white/30 text-white/70 hover:bg-white/10"
                                            disabled={!logoUrlInput.trim()}
                                        >
                                            Cargar desde URL
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>

            <div className="overflow-y-auto p-3 sm:p-4 bg-gray-50/80">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 py-12">
                        <div className="bg-gray-100 p-4 rounded-full">
                            <ShoppingCart className="h-10 w-10 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium">Ticket vacío</p>
                        <p className="text-xs text-gray-400">Agrega productos del catálogo</p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {cart.map((item) => (
                            <div
                                key={item.cartId}
                                className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-right-4 duration-300"
                            >
                                {/* Fila superior: Icono, Nombre y botón eliminar */}
                                <div className="flex items-start gap-2.5 mb-2">
                                    <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[10px] shadow-sm">
                                        {item.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{item.name}</p>
                                        <Badge
                                            variant="outline"
                                            className="text-[9px] h-4 px-1.5 mt-1 font-normal text-gray-500 border-gray-200 bg-gray-50"
                                        >
                                            {item.category}
                                        </Badge>
                                    </div>
                                    <button
                                        onClick={() => onRemove(item.cartId)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors shrink-0"
                                        aria-label={`Eliminar ${item.name}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                {/* Fila inferior: Precio editable */}
                                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">Precio:</span>
                                    <div className="flex items-center bg-blue-50 rounded-lg border border-blue-200 px-2 py-1">
                                        <span className="text-blue-600 font-bold text-sm mr-1">$</span>
                                        <Input
                                            type="number"
                                            value={item.sellingPrice}
                                            onChange={(e) => onUpdatePrice(item.cartId, Number(e.target.value) || 0)}
                                            className="w-16 h-6 text-sm font-bold text-blue-600 text-right p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer con Totales - siempre visible */}
            <div className="p-4 sm:p-5 bg-white border-t border-gray-200">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Productos ({cart.length})</span>
                        <span className="font-medium">${totals.subtotal}</span>
                    </div>
                    {totals.labor > 0 && (
                        <div className="flex justify-between text-sm text-amber-600">
                            <span className="flex items-center gap-1">
                                <Wrench className="h-3 w-3" />
                                Mano de obra
                            </span>
                            <span className="font-medium">+${totals.labor}</span>
                        </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-gray-600">Total a Pagar</span>
                        <span className="text-3xl font-black text-gray-900 tracking-tight">${totals.total}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        onClick={onPrint}
                        className="border-gray-300 hover:bg-gray-100 h-11 text-gray-700 font-bold rounded-xl bg-transparent"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                    <Button
                        onClick={onSend}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-11 text-white shadow-lg shadow-green-500/25 font-bold rounded-xl"
                    >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                    </Button>
                </div>

                {cart.length > 0 && (
                    <button
                        onClick={onClear}
                        className="w-full mt-3 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center justify-center gap-1 py-2 transition-colors rounded-lg hover:bg-red-50"
                    >
                        <Trash2 className="h-3 w-3" />
                        Vaciar ticket
                    </button>
                )}
            </div>
        </div>
    )
}

// --- TICKET IMPRIMIBLE (Datos en blanco si no se modifican) ---
const PrintableTicket = ({ cart, totals, clientName, clientPhone, companyData }: PrintableTicketProps) => (
    <div className="hidden print:block p-8 bg-white text-black font-sans max-w-[800px] mx-auto">
        {/* Encabezado con logo opcional */}
        <div className="text-center mb-6 border-b-2 border-black pb-4">
            {companyData.logo && (
                <img src={companyData.logo || "/placeholder.svg"} alt="Logo" className="w-24 mx-auto mb-2 object-contain" />
            )}
            {companyData.name && <h1 className="text-3xl font-black uppercase tracking-wider mb-1">{companyData.name}</h1>}
            <p className="text-sm text-gray-500 mb-2">Refacciones y Servicio Técnico para Celulares</p>
            <div className="text-sm text-gray-600">
                {companyData.address && <p>{companyData.address}</p>}
                {companyData.phone && <p>Tel: {companyData.phone}</p>}
            </div>
        </div>

        {/* Datos del Cliente */}
        <div className="flex justify-between mb-6 text-sm bg-gray-50 p-4 border border-gray-200 rounded">
            <div>
                <p className="font-bold text-gray-500 text-xs uppercase">Cliente</p>
                <p className="text-lg font-bold">{clientName || "Mostrador"}</p>
                {clientPhone && <p className="text-gray-600">{clientPhone}</p>}
            </div>
            <div className="text-right">
                <p className="font-bold text-gray-500 text-xs uppercase">Fecha</p>
                <p>{new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</p>
                <p className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>
        </div>

        {companyData.repairer && (
            <div className="mb-4 text-sm">
                <span className="font-bold text-gray-500 text-xs uppercase">Atendió: </span>
                <span className="font-medium">{companyData.repairer}</span>
            </div>
        )}

        {/* Tabla de Productos */}
        <table className="w-full mb-6 text-sm border-collapse">
            <thead>
                <tr className="border-b-2 border-black">
                    <th className="text-left py-2 font-bold uppercase">Descripción</th>
                    <th className="text-right py-2 font-bold uppercase w-24">Precio</th>
                </tr>
            </thead>
            <tbody>
                {cart.map((item) => (
                    <tr key={item.cartId} className="border-b border-gray-300 border-dashed">
                        <td className="py-3">
                            <span className="font-bold block">{item.name}</span>
                            <span className="text-xs text-gray-500 uppercase">{item.category}</span>
                        </td>
                        <td className="py-3 text-right font-bold">${item.sellingPrice.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end">
            <div className="w-56">
                <div className="flex justify-between py-1 text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.labor > 0 && (
                    <div className="flex justify-between py-1 text-gray-600 text-sm border-b border-gray-300 pb-2">
                        <span>Mano de obra</span>
                        <span>+${totals.labor.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between py-2 text-xl font-black border-t-2 border-black mt-1">
                    <span>TOTAL</span>
                    <span>${totals.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Pie de página */}
        <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>Precios sujetos a cambios sin previo aviso.</p>
            <p className="mt-1">Gracias por su preferencia.</p>
        </div>
    </div>
)

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
    
    // Estado para saber si ya cargamos datos del LocalStorage
    const [isInitialized, setIsInitialized] = useState(false)

    // NUEVO: Estado para paginación
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

    const [companyData, setCompanyData] = useState<CompanyData>({
        name: "",
        address: "",
        phone: "",
        repairer: "",
        logo: null,
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    // 1. EFECTO DE CARGA INICIAL (PERSISTENCIA)
    useEffect(() => {
        // Intentar leer LocalStorage al montar el componente
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.cart) setCart(parsed.cart);
                if (parsed.clientName) setClientName(parsed.clientName);
                if (parsed.clientPhone) setClientPhone(parsed.clientPhone);
                if (parsed.laborCost) setLaborCost(parsed.laborCost);
                if (parsed.companyData) setCompanyData(parsed.companyData);
                // toast.info("Sesión recuperada", { position: "bottom-center", duration: 2000 });
            } catch (e) {
                console.error("Error al leer LocalStorage", e);
            }
        }
        setIsInitialized(true); // Marcar como inicializado para permitir guardar cambios futuros
    }, []);

    // 2. EFECTO DE GUARDADO AUTOMÁTICO
    useEffect(() => {
        // Solo guardar si ya se cargaron los datos iniciales
        if (isInitialized) {
            const stateToSave = {
                cart,
                clientName,
                clientPhone,
                laborCost,
                companyData
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        }
    }, [cart, clientName, clientPhone, laborCost, companyData, isInitialized]);


    // Fetch de productos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = process.env.NODE_ENV === "development" ? "/api/refacciones" : "/api/refacciones.php"
                const response = await fetch(apiUrl)
                let data: ProductBase[] = []
                if (response.ok) {
                    data = await response.json()
                }

                const processedProducts = Array.isArray(data)
                    ? data.map((p) => {
                        const pricing = calculateSellingPrice(p.price, p.category, p.name)
                        return {
                            ...p,
                            sellingPrice: pricing.sellingPrice,
                        }
                    })
                    : []

                setProducts(processedProducts)
            } catch (error) {
                console.error("Error cargando cotizador:", error)
                toast.error("Error al cargar productos")
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Reiniciar paginación al cambiar filtros o búsqueda
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE)
    }, [searchQuery, selectedCategory])

    // Funciones del carrito
    const addToCart = (product: ProductWithPrice) => {
        const newItem: CartItem = { ...product, cartId: crypto.randomUUID() }
        setCart((prev) => [...prev, newItem])
        toast.success("Agregado al ticket", {
            duration: 1500,
            position: "bottom-center",
            icon: <Package className="h-4 w-4" />,
        })
    }

    const removeFromCart = (cartId: string) => {
        setCart((prev) => prev.filter((item) => item.cartId !== cartId))
        toast.info("Producto eliminado", { duration: 1000, position: "bottom-center" })
    }

    const clearCart = () => {
        // Limpiamos el carrito, pero mantenemos los datos de la empresa si el usuario los puso
        setCart([])
        setLaborCost("")
        setClientName("")
        setClientPhone("")
        toast.info("Ticket vaciado", { duration: 1000, position: "bottom-center" })
    }

    const updateItemPrice = (cartId: string, newPrice: number) => {
        setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, sellingPrice: newPrice } : item)))
    }

    const totals = useMemo(() => {
        const subtotal = cart.reduce((acc, item) => acc + item.sellingPrice, 0)
        const labor = Number(laborCost) || 0
        const total = subtotal + labor
        return { subtotal, labor, total }
    }, [cart, laborCost])

    // Categorías dinámicas
    const categories = useMemo(
        () => ["Todos", ...Array.from(new Set(products.map((p) => p.category))).sort()],
        [products],
    )

    // Filtrado de productos
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchCat = selectedCategory === "Todos" || p.category === selectedCategory
            return matchSearch && matchCat
        })
    }, [products, searchQuery, selectedCategory])

    // NUEVO: Productos visibles recortados por la paginación
    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount)
    }, [filteredProducts, visibleCount])

    // NUEVO: Manejador para cargar más
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
    }

    const handleSendWhatsApp = () => {
        if (!clientPhone) {
            toast.error("Agrega un teléfono del cliente")
            return
        }
        if (cart.length === 0) {
            toast.error("El ticket está vacío")
            return
        }

        const cleanPhone = clientPhone.replace(/\D/g, "")
        const finalPhone = cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone

        let message = `Hola${clientName ? " " + clientName : ""}!\n\n`

        if (companyData.name) {
            message += `Tu cotizacion de *${companyData.name}*:\n\n`
        } else {
            message += `Tu cotizacion:\n\n`
        }

        cart.forEach((item) => {
            message += `- ${item.name}: $${item.sellingPrice}\n`
        })

        if (totals.labor > 0) {
            message += `\nMano de obra: $${totals.labor}\n`
        }

        message += `\n--------------------\n`
        message += `*TOTAL: $${totals.total}*\n`

        if (companyData.name || companyData.address || companyData.phone) {
            message += `\n`
            if (companyData.name || companyData.address) {
                message += `${[companyData.name, companyData.address].filter(Boolean).join(" - ")}\n`
            }
            if (companyData.phone) {
                message += `Tel: ${companyData.phone}`
            }
        }
        message += `\n\nEsta cotización puede tener cambios, por favor contacte al taller de reparación ${companyData.name || ""}`

        window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, "_blank")
        toast.success("Abriendo WhatsApp...")
    }

    const handlePrint = () => {
        if (cart.length === 0) {
            toast.error("El ticket está vacío")
            return
        }
        const originalTitle = document.title
        document.title = companyData.name ? `Cotización - ${companyData.name}` : "Cotización"
        window.print()
        setTimeout(() => {
            document.title = originalTitle
        }, 1000)
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("El archivo es muy grande (máx. 2MB)")
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setCompanyData((prev) => ({ ...prev, logo: reader.result as string }))
                toast.success("Logo cargado")
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <>
            {/* Estilos globales para impresión */}
            <style jsx global>{`
        @media print {
          @page {
            margin: 20mm;
            margin-top: 10mm;
            margin-bottom: 10mm;
          }
          body > *:not(#print-area-wrapper) {
            display: none !important;
          }
          #print-area-wrapper {
            display: block !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            background: white;
            z-index: 9999;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

            {/* Wrapper de Impresión */}
            <div id="print-area-wrapper" className="hidden">
                <PrintableTicket
                    cart={cart}
                    totals={totals}
                    clientName={clientName}
                    clientPhone={clientPhone}
                    companyData={companyData}
                />
            </div>

            {/* Layout Principal */}
            <div className="h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50/30 flex flex-col md:flex-row overflow-hidden print:hidden">
                {/* Catálogo (70% en desktop) */}
                <div className="flex-1 flex flex-col h-full min-w-0">
                    {/* Header con búsqueda y filtros */}
                    <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-4 border-b border-gray-200/60 z-10 shadow-sm">
                        {/* Logo y Búsqueda */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="font-black text-lg text-gray-900 leading-none">YESMOS</h1>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Cotizador</p>
                                </div>
                            </div>

                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar producto..."
                                    className="pl-10 bg-gray-50/80 border-gray-200 focus-visible:ring-blue-500 rounded-xl h-11"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filtros de Categoría */}
                        <ScrollArea className="w-full whitespace-nowrap pb-1">
                            <div className="flex gap-2">
                                {categories.map((cat) => (
                                    <Badge
                                        key={cat}
                                        variant={selectedCategory === cat ? "default" : "outline"}
                                        className={cn(
                                            "cursor-pointer px-4 py-1.5 rounded-full transition-all border text-xs font-semibold shrink-0",
                                            selectedCategory === cat
                                                ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-md shadow-blue-500/20"
                                                : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300",
                                        )}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </Badge>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Grid de Productos */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center space-y-3">
                                    <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto" />
                                    <p className="text-sm text-gray-500">Cargando catálogo...</p>
                                </div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center space-y-3">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto" />
                                    <p className="text-gray-500">No se encontraron productos</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery("")
                                            setSelectedCategory("Todos")
                                        }}
                                    >
                                        Limpiar filtros
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* NUEVO: Mapear displayedProducts en lugar de filteredProducts */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 pb-6">
                                    {displayedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} onAdd={addToCart} />
                                    ))}
                                </div>

                                {/* NUEVO: Botón Cargar Más */}
                                {visibleCount < filteredProducts.length && (
                                    <div className="flex justify-center pb-24 md:pb-12">
                                        <Button
                                            onClick={handleLoadMore}
                                            variant="outline"
                                            className="min-w-[200px] rounded-full border-blue-200 text-blue-600 bg-white hover:bg-blue-50 font-bold shadow-sm h-12"
                                        >
                                            <ChevronDown className="mr-2 h-4 w-4" />
                                            Cargar más productos
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar Ticket Desktop (30%) */}
                <div className="hidden md:block w-[380px] h-full shrink-0 relative z-20">
                    <TicketSidebar
                        cart={cart}
                        totals={totals}
                        clientName={clientName}
                        setClientName={setClientName}
                        clientPhone={clientPhone}
                        setClientPhone={setClientPhone}
                        laborCost={laborCost}
                        setLaborCost={setLaborCost}
                        onRemove={removeFromCart}
                        onClear={clearCart}
                        onPrint={handlePrint}
                        onSend={handleSendWhatsApp}
                        onUpdatePrice={updateItemPrice}
                        companyData={companyData}
                        setCompanyData={setCompanyData}
                        onLogoUpload={handleLogoUpload}
                        fileInputRef={fileInputRef}
                    />
                </div>

                {/* Footer Móvil con Sheet */}
                <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 flex justify-between items-center shadow-2xl shadow-gray-300/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">Total</span>
                        <span className="text-2xl font-black text-gray-900">${totals.total}</span>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 h-12 shadow-xl shadow-blue-500/30 font-bold">
                                <ScanBarcode className="mr-2 h-5 w-5" />
                                Ver Ticket
                                {cart.length > 0 && (
                                    <Badge className="ml-2 bg-white/20 text-white border-none text-xs">{cart.length}</Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[92vh] rounded-t-[2rem] p-0 overflow-hidden border-0">
                            <TicketSidebar
                                cart={cart}
                                totals={totals}
                                clientName={clientName}
                                setClientName={setClientName}
                                clientPhone={clientPhone}
                                setClientPhone={setClientPhone}
                                laborCost={laborCost}
                                setLaborCost={setLaborCost}
                                onRemove={removeFromCart}
                                onClear={clearCart}
                                onPrint={handlePrint}
                                onSend={handleSendWhatsApp}
                                onUpdatePrice={updateItemPrice}
                                companyData={companyData}
                                setCompanyData={setCompanyData}
                                onLogoUpload={handleLogoUpload}
                                fileInputRef={fileInputRef}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    )
}