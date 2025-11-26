import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Home, AlertCircle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col bg-[#f9fafb]">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="space-y-6 max-w-md mx-auto">
                    {/* Icono animado */}
                    <div className="relative flex justify-center mb-8">
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                        <div className="relative bg-white p-6 rounded-full shadow-lg border border-gray-100">
                            <AlertCircle className="h-16 w-16 text-[#3b82f6]" />
                        </div>
                    </div>

                    {/* Texto Principal */}
                    <h1 className="text-7xl font-black text-[#111827] tracking-tighter">404</h1>
                    <h2 className="text-2xl font-bold text-gray-800">¡Ups! Página no encontrada</h2>

                    <p className="text-gray-500 text-lg">
                        Parece que la refacción o página que buscas se ha movido o no existe en nuestro catálogo.
                    </p>

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button asChild className="bg-[#3b82f6] hover:bg-[#2563eb] h-12 px-8 text-base rounded-full">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Ir al Inicio
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="border-gray-300 h-12 px-8 text-base rounded-full hover:bg-gray-50">
                            <Link href="/#catalogo">
                                <Search className="mr-2 h-4 w-4" />
                                Buscar Refacción
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}