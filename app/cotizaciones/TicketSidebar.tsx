"use client"

import { useState, type RefObject, type ChangeEvent } from "react"
import {
    Trash2,
    Printer,
    MessageCircle,
    User,
    Phone,
    ScanBarcode,
    Wrench,
    Upload,
    LinkIcon,
    X,
    ChevronDown,
    Settings,
    ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// --- TIPOS EXPORTADOS ---
export interface ProductBase {
    id: number
    name: string
    price: number
    category: string
    image: string
    url: string
    available: boolean
}

export interface ProductWithPrice extends ProductBase {
    sellingPrice: number
}

export interface CartItem extends ProductWithPrice {
    cartId: string
}

export interface CompanyData {
    name: string
    address: string
    phone: string
    repairer: string
    logo: string | null
}

export interface TicketProps {
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
    onLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void
    fileInputRef: RefObject<HTMLInputElement | null>
}

export interface PrintableTicketProps {
    cart: CartItem[]
    totals: { subtotal: number; labor: number; total: number }
    clientName: string
    clientPhone: string
    companyData: CompanyData
}

// --- COMPONENTE TICKET SIDEBAR ---
export function TicketSidebar({
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
}: TicketProps) {
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
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
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

                {/* Inputs */}
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
                        <Input value={companyData.name} onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })} placeholder="Nombre de la empresa" className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-9 text-sm rounded-lg" />
                        <Input value={companyData.address} onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })} placeholder="Dirección" className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-9 text-sm rounded-lg" />
                        <Input value={companyData.phone} onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })} placeholder="Teléfono de la empresa" className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-9 text-sm rounded-lg" />
                        <Input value={companyData.repairer} onChange={(e) => setCompanyData({ ...companyData, repairer: e.target.value })} placeholder="Nombre del reparador" className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400 h-9 text-sm rounded-lg" />

                        {/* Logo */}
                        <div className="pt-1">
                            <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1.5">Logo (opcional)</p>
                            {companyData.logo ? (
                                <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                                    <img src={companyData.logo || "/placeholder.svg"} alt="Logo" className="h-10 w-10 object-contain rounded" />
                                    <span className="text-xs text-white/70 flex-1">Logo cargado</span>
                                    <button onClick={handleRemoveLogo} className="text-red-400 hover:text-red-300 p-1"><X className="h-4 w-4" /></button>
                                </div>
                            ) : (
                                <Tabs defaultValue="upload" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 h-8 bg-white/10">
                                        <TabsTrigger value="upload" className="text-[10px] text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white"><Upload className="h-3 w-3 mr-1" /> Subir</TabsTrigger>
                                        <TabsTrigger value="url" className="text-[10px] text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white"><LinkIcon className="h-3 w-3 mr-1" /> URL</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upload" className="mt-2">
                                        <input type="file" ref={fileInputRef} onChange={onLogoUpload} accept="image/*" className="hidden" />
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full h-12 border-dashed border-white/30 bg-transparent hover:bg-white/10 text-white/70"><div className="flex flex-col items-center gap-0.5"><Upload className="h-4 w-4" /><span className="text-[10px]">Click para subir (máx. 2MB)</span></div></Button>
                                    </TabsContent>
                                    <TabsContent value="url" className="mt-2 space-y-1.5">
                                        <Input value={logoUrlInput} onChange={(e) => setLogoUrlInput(e.target.value)} placeholder="https://ejemplo.com/logo.png" className="bg-white/90 text-gray-900 border-0 h-8 text-xs" />
                                        <Button variant="outline" onClick={handleLogoUrl} className="w-full h-8 text-xs bg-transparent border-white/30 text-white/70 hover:bg-white/10" disabled={!logoUrlInput.trim()}>Cargar desde URL</Button>
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
                            <div key={item.cartId} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-right-4 duration-300">
                                <div className="flex items-start gap-2.5 mb-2">
                                    <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[10px] shadow-sm">
                                        {item.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{item.name}</p>
                                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 mt-1 font-normal text-gray-500 border-gray-200 bg-gray-50">{item.category}</Badge>
                                    </div>
                                    <button onClick={() => onRemove(item.cartId)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors shrink-0">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">Precio:</span>
                                    <div className="flex items-center bg-blue-50 rounded-lg border border-blue-200 px-2 py-1">
                                        <span className="text-blue-600 font-bold text-sm mr-1">$</span>
                                        <Input type="number" value={item.sellingPrice} onChange={(e) => onUpdatePrice(item.cartId, Number(e.target.value) || 0)} className="w-16 h-6 text-sm font-bold text-blue-600 text-right p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" min="0" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-gray-200">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Productos ({cart.length})</span>
                        <span className="font-medium">${totals.subtotal}</span>
                    </div>
                    {totals.labor > 0 && (
                        <div className="flex justify-between text-sm text-amber-600">
                            <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> Mano de obra</span>
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
                    <Button variant="outline" onClick={onPrint} className="border-gray-300 hover:bg-gray-100 h-11 text-gray-700 font-bold rounded-xl bg-transparent"><Printer className="mr-2 h-4 w-4" /> PDF</Button>
                    <Button onClick={onSend} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-11 text-white shadow-lg shadow-green-500/25 font-bold rounded-xl"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</Button>
                </div>
                {cart.length > 0 && (
                    <button onClick={onClear} className="w-full mt-3 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center justify-center gap-1 py-2 transition-colors rounded-lg hover:bg-red-50"><Trash2 className="h-3 w-3" /> Vaciar ticket</button>
                )}
            </div>
        </div>
    )
}

// --- COMPONENTE PRINTABLE TICKET ---
export function PrintableTicket({ cart, totals, clientName, clientPhone, companyData }: PrintableTicketProps) {
    return (
        <div className="hidden print:block p-8 bg-white text-black font-sans max-w-[800px] mx-auto">
            <div className="text-center mb-6 border-b-2 border-black pb-4">
                {companyData.logo && (<img src={companyData.logo || "/placeholder.svg"} alt="Logo" className="w-24 mx-auto mb-2 object-contain" />)}
                {companyData.name && <h1 className="text-3xl font-black uppercase tracking-wider mb-1">{companyData.name}</h1>}
                <p className="text-sm text-gray-500 mb-2">Refacciones y Servicio Técnico para Celulares</p>
                <div className="text-sm text-gray-600">
                    {companyData.address && <p>{companyData.address}</p>}
                    {companyData.phone && <p>Tel: {companyData.phone}</p>}
                </div>
            </div>
            <div className="flex justify-between mb-6 text-sm bg-gray-50 p-4 border border-gray-200 rounded">
                <div><p className="font-bold text-gray-500 text-xs uppercase">Cliente</p><p className="text-lg font-bold">{clientName || "Mostrador"}</p>{clientPhone && <p className="text-gray-600">{clientPhone}</p>}</div>
                <div className="text-right"><p className="font-bold text-gray-500 text-xs uppercase">Fecha</p><p>{new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</p><p className="text-xs text-gray-500">{new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</p></div>
            </div>
            {companyData.repairer && (<div className="mb-4 text-sm"><span className="font-bold text-gray-500 text-xs uppercase">Atendió: </span><span className="font-medium">{companyData.repairer}</span></div>)}
            <table className="w-full mb-6 text-sm border-collapse">
                <thead><tr className="border-b-2 border-black"><th className="text-left py-2 font-bold uppercase">Descripción</th><th className="text-right py-2 font-bold uppercase w-24">Precio</th></tr></thead>
                <tbody>{cart.map((item) => (<tr key={item.cartId} className="border-b border-gray-300 border-dashed"><td className="py-3"><span className="font-bold block">{item.name}</span><span className="text-xs text-gray-500 uppercase">{item.category}</span></td><td className="py-3 text-right font-bold">${item.sellingPrice.toFixed(2)}</td></tr>))}</tbody>
            </table>
            <div className="flex justify-end">
                <div className="w-56">
                    <div className="flex justify-between py-1 text-gray-600 text-sm"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
                    {totals.labor > 0 && (<div className="flex justify-between py-1 text-gray-600 text-sm border-b border-gray-300 pb-2"><span>Mano de obra</span><span>+${totals.labor.toFixed(2)}</span></div>)}
                    <div className="flex justify-between py-2 text-xl font-black border-t-2 border-black mt-1"><span>TOTAL</span><span>${totals.total.toFixed(2)}</span></div>
                </div>
            </div>
            <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500"><p>Precios sujetos a cambios sin previo aviso.</p><p className="mt-1">Gracias por su preferencia.</p></div>
        </div>
    )
}