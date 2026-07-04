import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Yesmos Celulares',
  description: 'Lee nuestros términos y condiciones para compra de refacciones y servicio de reparación de celulares.',
}

export default function TerminosCondiciones() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Términos y Condiciones</h1>

      {/* Table of Contents */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Índice</h2>
        <ul className="space-y-2">
          <li><a href="#aceptacion" className="text-blue-600 hover:underline">1. Aceptación de Términos</a></li>
          <li><a href="#descripcion" className="text-blue-600 hover:underline">2. Descripción del Servicio</a></li>
          <li><a href="#reparacion" className="text-blue-600 hover:underline">3. Servicio de Reparación</a></li>
          <li><a href="#refacciones" className="text-blue-600 hover:underline">4. Venta de Refacciones</a></li>
          <li><a href="#devoluciones" className="text-blue-600 hover:underline">5. Devoluciones y Cambios</a></li>
          <li><a href="#garantia" className="text-blue-600 hover:underline">6. Garantía</a></li>
          <li><a href="#limitacion" className="text-blue-600 hover:underline">7. Limitación de Responsabilidad</a></li>
          <li><a href="#contacto" className="text-blue-600 hover:underline">8. Contacto Legal</a></li>
        </ul>
      </div>

      {/* Section 1 */}
      <section id="aceptacion" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de Términos</h2>
        <p className="text-gray-700 mb-4">
          Al acceder y utilizar el sitio web de Yesmos Celulares (yesmos.com), aceptas que has leído, comprendido y estás de acuerdo con todos estos Términos y Condiciones. Si no aceptas estos términos, no debes usar este sitio web.
        </p>
      </section>

      {/* Section 2 */}
      <section id="descripcion" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descripción del Servicio</h2>
        <p className="text-gray-700 mb-4">
          Yesmos Celulares ofrece los siguientes servicios:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>Venta de refacciones:</strong> Distribuimos refacciones de alta calidad compatible a reparadores profesionales en la región (tarifa mayorista).</li>
          <li><strong>Servicio de reparación:</strong> Ofrecemos servicio técnico de reparación de celulares al público general (cotizador).</li>
        </ul>
        <p className="text-gray-700">
          Operamos bajo un modelo dual: mayorista para reparadores profesionales, y retail para clientes finales.
        </p>
      </section>

      {/* Section 3 */}
      <section id="reparacion" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Servicio de Reparación</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Proceso General</h3>
            <p>El cliente deja el equipo con Yesmos Celulares. Realizamos diagnóstico, presupuesto y reparación. El cliente recibe el equipo reparado.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tiempo Estimado</h3>
            <p>Los tiempos de reparación varían según el tipo de servicio y disponibilidad de repuestos. Se proporcionará tiempo estimado en el presupuesto.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Responsabilidad</h3>
            <p>Una vez que el cliente recibe el equipo reparado, Yesmos Celulares no es responsable de daños posteriores. El cliente es responsable de recoger el equipo en el tiempo acordado. Equipos no recogidos después de 30 días pueden ser dispuestos conforme a la ley.</p>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section id="refacciones" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Venta de Refacciones</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Descripción de Productos</h3>
            <p>Ofrecemos refacciones de alta calidad compatible. Nuestros productos no son originales de marca directa, pero ofrecemos la mejor calidad disponible en el mercado regional.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Disponibilidad</h3>
            <p>La disponibilidad de productos está sujeta a cambios sin previo aviso. No garantizamos que todos los artículos listados en el sitio estén siempre en stock.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Precios</h3>
            <p>Los precios están sujetos a cambios. Los precios mostrados en el sitio son válidos al momento de consulta. Cualquier cambio será comunicado vía WhatsApp antes de confirmar la venta.</p>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section id="devoluciones" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Devoluciones y Cambios</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Plazo</h3>
            <p>Las devoluciones y cambios deben solicitarse dentro de 7 días desde la fecha de compra.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Condiciones</h3>
            <p>El producto debe estar:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Sin uso (en condición de nuevo)</li>
              <li>En empaque original intacto</li>
              <li>Con sellos de garantía intactos</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Proceso</h3>
            <p>Contacta vía WhatsApp con tu comprobante de compra y describe el motivo del cambio/devolución. Yesmos Celulares evaluará la solicitud.</p>
          </div>
        </div>
      </section>

      {/* Section 6 */}
      <section id="garantia" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Garantía</h2>
        <p className="text-gray-700 mb-4">
          Para información detallada sobre garantía de refacciones y servicios de reparación, consulta nuestra <a href="/legal/garantia" className="text-blue-600 hover:underline">Política de Garantía</a>.
        </p>
      </section>

      {/* Section 7 */}
      <section id="limitacion" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitación de Responsabilidad</h2>
        <p className="text-gray-700 mb-4">
          Yesmos Celulares NO es responsable por:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Daños indirectos, incidentales o consecuentes</li>
          <li>Pérdida de datos o información en dispositivos</li>
          <li>Daños causados por terceros después de la entrega del servicio</li>
          <li>Errores en precios (los cuales seremos responsables de corregir)</li>
          <li>Disponibilidad o acceso al sitio web</li>
        </ul>
      </section>

      {/* Section 8 */}
      <section id="contacto" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contacto Legal</h2>
        <div className="bg-gray-100 p-6 rounded-lg space-y-3 text-gray-700">
          <div>
            <span className="font-semibold">Negocio:</span> Yesmos Celulares
          </div>
          <div>
            <span className="font-semibold">Dirección:</span> Av. Constitución #206, Centro, Sahuayo, Michoacán 59000, México
          </div>
          <div>
            <span className="font-semibold">Teléfono:</span> +52 353 184 4881
          </div>
          <div>
            <span className="font-semibold">Email:</span> contacto@yesmos.com
          </div>
          <div>
            <span className="font-semibold">WhatsApp:</span> +52 353 184 4881
          </div>
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
