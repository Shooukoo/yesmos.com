import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet"
import { Menu, Phone, Search, Home, Smartphone, Wrench, Calculator, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* Puedes descomentar esto si quieres tu logo aquí también */}
          {/* <Image src="/Logo_Yesmos_Celu_Azul.png" width={40} height={40} alt="Logo" /> */}
          <span className="text-2xl font-bold text-[#3b82f6]">Yesmos.com</span>
        </Link>

        {/* --- NAVEGACIÓN DESKTOP --- */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#111827]">
          <Link href="/" className="hover:text-[#3b82f6] transition-colors">
            Inicio
          </Link>
          <Link href="/#catalogo" className="hover:text-[#3b82f6] transition-colors">
            Refacciones
          </Link>
          {/* Enlace Nuevo al Cotizador */}
          <Link href="/cotizaciones" className="hover:text-[#3b82f6] transition-colors flex items-center gap-1">
            <Calculator className="h-4 w-4" />
            Cotizador
          </Link>
          <Link href="/#contacto" className="hover:text-[#3b82f6] transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button 
            className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white"
            asChild
          >
            <a href="https://wa.me/523531844881" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" />
                Soporte Técnico
            </a>
          </Button>
        </div>

        {/* --- NAVEGACIÓN MÓVIL --- */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-[#111827]">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col p-6">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="text-2xl font-bold text-[#3b82f6]">Yesmos</SheetTitle>
              <SheetDescription className="sr-only">Navegación principal</SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col gap-1 flex-1">
              <Link
                href="/"
                className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all active:scale-[0.98]"
              >
                <Home className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6]" />
                Inicio
              </Link>
              <Link
                href="/#catalogo"
                className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all active:scale-[0.98]"
              >
                <Wrench className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6]" />
                Refacciones
              </Link>
              
              {/* Enlace Móvil al Cotizador */}
              <Link
                href="/cotizaciones"
                className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all active:scale-[0.98]"
              >
                <Calculator className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6]" />
                Cotizador POS
              </Link>

              <Link
                href="/#contacto"
                className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all active:scale-[0.98]"
              >
                <Mail className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6]" />
                Contacto
              </Link>
            </nav>

            <div className="mt-auto pt-6">
              <Button 
                className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white h-12 rounded-xl shadow-lg shadow-blue-200 gap-2 text-base font-semibold"
                asChild
              >
                <a href="https://wa.me/523531844881" target="_blank" rel="noopener noreferrer">
                    <Phone className="h-5 w-5" />
                    Contactar Soporte
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}