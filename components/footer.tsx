import Link from "next/link"
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#3b82f6]">Yesmos.com</h3>
            <p className="text-gray-400 text-sm">
              Tu aliado confiable en tecnología móvil. Venta, reparación y refacciones de la más alta calidad en
              Sahuayo.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-[#3b82f6] transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#3b82f6] transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-[#3b82f6] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#refacciones" className="hover:text-[#3b82f6] transition-colors">
                  Refacciones
                </Link>
              </li>
              <li>
                <Link href="#celulares" className="hover:text-[#3b82f6] transition-colors">
                  Celulares
                </Link>
              </li>
              <li>
                <Link href="#cotizador" className="hover:text-[#3b82f6] transition-colors">
                  Cotizador
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Venta de Equipos</li>
              <li>Reparación de Celulares</li>
              <li>Venta de Refacciones</li>
              <li>Accesorios</li>
              <li>Desbloqueos</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-[#3b82f6] shrink-0" />
                <span>Av. Constitución #123, Centro, Sahuayo, Michoacán</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#3b82f6] shrink-0" />
                <span>+52 353 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#3b82f6] shrink-0" />
                <span>contacto@yesmos.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Yesmos Celulares. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
