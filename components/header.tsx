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
          <span className="text-2xl font-bold text-[#3b82f6]">Yesmos.com</span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#111827]">
          <Link href="/" className="hover:text-[#3b82f6] transition-colors">
            Inicio
          </Link>
          <Link href="#catalogo" className="hover:text-[#3b82f6] transition-colors">
            Refacciones
          </Link>
          {/*
          <Link href="#celulares" className="hover:text-[#3b82f6] transition-colors">
            Celulares
          </Link>
          <Link href="#cotizador" className="hover:text-[#3b82f6] transition-colors">
            Cotizador
          </Link>
          */}
          <Link href="#contacto" className="hover:text-[#3b82f6] transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-[#111827]">
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
          <Button 
            className="bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white"
            asChild
          >
            <a href="https://wa.me/523531844881" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" />
                Cotizar Reparación
            </a>
          </Button>
        </div>

        {/* Navegación Móvil */}
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

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-[#3b82f6]"
              />
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              <Link
                href="/"
                className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all active:scale-[0.98]"
              >
                <Home className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6]" />
                Inicio
              </Link>
              <Link
                href="#catalogo"
                className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all active:scale-[0.98]"
              >
                <Wrench className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6]" />
                Refacciones
              </Link>
              {/* 
                <Link
                href="#celulares"
                className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all active:scale-[0.98]"
              >
                <Smartphone className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6]" />
                Celulares
              </Link>
              <Link
                href="#cotizador"
                className="flex items-center gap-4 px-4 py-3.5 text-base font-medium text-gray-700 rounded-xl hover:bg-blue-50 hover:text-[#3b82f6] transition-all active:scale-[0.98]"
              >
                <Calculator className="h-5 w-5 text-gray-500 group-hover:text-[#3b82f6]" />
                Cotizador
              </Link>
              */}
              <Link
                href="#contacto"
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
                    Cotizar Reparación
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}