import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Garantía | Yesmos Celulares',
  description: 'Detalles de garantía para refacciones y servicios de reparación en Yesmos Celulares.',
}

export default function Garantia() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Política de Garantía</h1>

      {/* Table of Contents */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Índice</h2>
        <ul className="space-y-2">
          <li><a href="#refacciones" className="text-blue-600 hover:underline">1. Garantía de Refacciones</a></li>
          <li><a href="#reparacion" className="text-blue-600 hover:underline">2. Garantía de Servicios de Reparación</a></li>
          <li><a href="#proceso" className="text-blue-600 hover:underline">3. Proceso de Garantía</a></li>
        </ul>
      </div>

      {/* Section 1: Refacciones */}
      <section id="refacciones" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Garantía de Refacciones</h2>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-green-900 mb-3">✓ Cubrimos defectos de fabricación por 30 días</h3>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Requisitos para aplicar garantía:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
              <li>La refacción debe devolverse <strong>intacta, sin pegamento, sin roturas</strong></li>
              <li>Debe mantener los <strong>sellos de garantía intactos</strong></li>
              <li>Debe acompañarse del <strong>comprobante de compra original</strong></li>
              <li>Debe estar dentro del período de 30 días desde la compra</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Si no cumples estos requisitos:</h3>
            <p className="text-gray-700 bg-red-50 p-4 rounded-lg border border-red-200">
              No aplica garantía. El cambio o devolución será rechazado.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Qué hacer en caso de defecto:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Contacta vía WhatsApp inmediatamente</li>
              <li>Envía fotos de la pieza defectuosa (si aplica)</li>
              <li>Proporciona tu comprobante de compra</li>
              <li>Yesmos evaluará y te ofrecerá reemplazo o reembolso</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Section 2: Servicios de Reparación */}
      <section id="reparacion" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Garantía de Servicios de Reparación</h2>

        <div className="space-y-8">
          {/* Pantallas */}
          <div>
            <h3 className="font-bold text-red-600 mb-3">❌ PANTALLAS: SIN GARANTÍA</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-700">
                No ofrecemos garantía en reparaciones de pantallas. Una vez que instalamos la pantalla, la garantía sobre daños es responsabilidad del cliente.
              </p>
            </div>
          </div>

          {/* Otras Reparaciones */}
          <div>
            <h3 className="font-bold text-green-600 mb-3">✓ OTRAS REPARACIONES: SÍ, CON CONDICIONES</h3>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700">
                Cubrimos defectos en el trabajo realizado por <strong>15 días</strong> desde la entrega.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Requisitos para aplicar garantía:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
                <li>El equipo <strong>NO debe haber sido manipulado por terceros</strong> después de la reparación</li>
                <li>El equipo debe presentarse <strong>sin daños adicionales externos</strong></li>
                <li>El equipo debe estar en las <strong>mismas condiciones físicas</strong> en que se entregó</li>
                <li>Dentro del período de <strong>15 días</strong> desde la fecha de entrega</li>
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Qué NO cubre garantía:</h4>
              <ul className="list-disc list-inside space-y-2 text-red-700 bg-red-50 p-4 rounded-lg">
                <li>Daño por mal uso del cliente</li>
                <li>Caídas o golpes posteriores a la reparación</li>
                <li>Daño por agua o líquidos</li>
                <li>Manipulación por terceros después de entrega</li>
                <li>Desgaste normal por uso</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Proceso */}
      <section id="proceso" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Proceso de Garantía</h2>

        <div className="space-y-4">
          <p className="text-gray-700">
            Para reclamar garantía en refacciones o servicios:
          </p>

          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            <li>
              <strong>Contacta vía WhatsApp:</strong> +52 353 184 4881
            </li>
            <li>
              <strong>Proporciona:</strong> Comprobante de compra/reparación y descripción detallada del problema
            </li>
            <li>
              <strong>Envía fotos:</strong> Imágenes del defecto (si aplica)
            </li>
            <li>
              <strong>Evaluación:</strong> Yesmos evaluará tu solicitud en máximo 48 horas
            </li>
            <li>
              <strong>Resolución:</strong> Reemplazo, reparación adicional, o reembolso según corresponda
            </li>
          </ol>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-900 font-semibold mb-2">💬 Contacto para Garantía:</p>
          <ul className="text-gray-700 space-y-1">
            <li><strong>WhatsApp:</strong> +52 353 184 4881</li>
            <li><strong>Teléfono:</strong> +52 353 184 4881</li>
            <li><strong>Email:</strong> contacto@yesmos.com</li>
          </ul>
        </div>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <p className="text-sm text-gray-600">
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </p>
      </div>
    </>
  )
}
