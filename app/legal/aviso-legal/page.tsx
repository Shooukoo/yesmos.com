import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal | Yesmos Celulares',
  description: 'Información legal, disclaimers de marcas y responsabilidades de Yesmos Celulares.',
}

export default function AvisoLegal() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Aviso Legal</h1>

      {/* Table of Contents */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Índice</h2>
        <ul className="space-y-2">
          <li><a href="#identidad" className="text-blue-600 hover:underline">1. Identidad del Negocio</a></li>
          <li><a href="#marcas" className="text-blue-600 hover:underline">2. Disclaimer de Marcas</a></li>
          <li><a href="#calidad" className="text-blue-600 hover:underline">3. Calidad de Productos</a></li>
          <li><a href="#exencion" className="text-blue-600 hover:underline">4. Exención de Responsabilidad</a></li>
          <li><a href="#cambios" className="text-blue-600 hover:underline">5. Cambios en el Sitio</a></li>
        </ul>
      </div>

      {/* Section 1 */}
      <section id="identidad" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Identidad del Negocio</h2>
        <div className="bg-gray-100 p-6 rounded-lg space-y-3 text-gray-700">
          <div>
            <span className="font-semibold">Nombre Comercial:</span> Yesmos Celulares
          </div>
          <div>
            <span className="font-semibold">Ubicación:</span> Av. Constitución #206, Centro, Sahuayo, Michoacán 59000, México
          </div>
          <div>
            <span className="font-semibold">Teléfono:</span> +52 353 184 4881
          </div>
          <div>
            <span className="font-semibold">Email:</span> contacto@yesmos.com
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section id="marcas" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Disclaimer de Marcas</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
          <p className="text-gray-700 font-semibold mb-2">⚠️ Aviso Importante</p>
          <p className="text-gray-700">
            <strong>Yesmos Celulares NO es distribuidor oficial</strong> de Apple, Samsung, OPPO, Huawei, Honor, ZTE ni de otras marcas de fabricantes de dispositivos móviles.
          </p>
        </div>
        <p className="text-gray-700 mb-4">
          Los nombres, logos y marcas registradas mencionadas en este sitio son propiedad intelectual de sus respectivos dueños. Usamos estas referencias únicamente de manera informativa para describir la compatibilidad de nuestros productos y servicios.
        </p>
        <p className="text-gray-700">
          El uso de estos nombres y marcas en nuestro sitio web no implica endorso, afiliación, o relación comercial con los fabricantes de estas marcas.
        </p>
      </section>

      {/* Section 3 */}
      <section id="calidad" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Calidad de Productos</h2>
        <p className="text-gray-700 mb-4">
          Yesmos Celulares ofrece refacciones y accesorios de alta calidad compatible para dispositivos móviles. Nuestros productos:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>NO son originales</strong> fabricados directamente por los fabricantes de marca</li>
          <li><strong>SON compatible</strong> en calidad, especificaciones y funcionalidad</li>
          <li>Representan <strong>la mejor calidad disponible</strong> en el mercado regional</li>
          <li>Ofrecen <strong>la mejor relación precio-calidad</strong> para reparadores y clientes finales</li>
        </ul>
        <p className="text-gray-700">
          Los clientes entienden y aceptan que están comprando productos compatibles de alta calidad, no productos originales de marca.
        </p>
      </section>

      {/* Section 4 */}
      <section id="exencion" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Exención de Responsabilidad</h2>
        <p className="text-gray-700 mb-4">
          Yesmos Celulares se exime de responsabilidad por:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Errores en precios mostrados (nos comprometemos a corregirlos inmediatamente)</li>
          <li>Disponibilidad de productos (stock sujeto a cambios sin aviso previo)</li>
          <li>Descripciones de productos (haremos nuestro mejor esfuerzo por ser precisos)</li>
          <li>Acceso o disponibilidad del sitio web</li>
          <li>Interpretación incorrecta de la información legal en este sitio</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section id="cambios" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cambios en el Sitio</h2>
        <p className="text-gray-700">
          Yesmos Celulares se reserva el derecho de cambiar, actualizar o remover cualquier contenido de este sitio web sin previo aviso. Esto incluye precios, descripciones de productos, políticas y cualquier otra información publicada.
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <p className="text-sm text-gray-600">
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </p>
      </div>
    </>
  )
}
