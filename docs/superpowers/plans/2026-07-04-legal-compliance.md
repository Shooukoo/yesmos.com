# Legal Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement complete legal structure (Terms & Conditions, Legal Notice, FAQ, Warranty Policy) + warning banner + footer links to protect the business and clarify wholesale vs. retail pricing.

**Architecture:** Create modular legal pages under `/app/legal/` with shared layout, add prominent warning banner on home to clarify wholesale pricing, and update footer with legal links. Each page is self-contained with its own metadata and styling.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS

## Global Constraints

- All pages must be in Spanish (es-MX locale)
- Use existing Tailwind color scheme (blue primary, red for warnings)
- Links to legal pages go in footer under new "Legal" column
- Banner must appear on home immediately after ProductCatalog
- All metadata must follow existing SEO pattern in `app/layout.tsx`
- No external dependencies for legal content (fully self-contained)

---

## File Structure

```
app/
├── legal/
│   ├── layout.tsx                    (shared layout with TOC & styles)
│   ├── terminos-condiciones/
│   │   └── page.tsx                  (Terms & Conditions)
│   ├── aviso-legal/
│   │   └── page.tsx                  (Legal Notice)
│   ├── precios-servicios/
│   │   └── page.tsx                  (Prices FAQ)
│   └── garantia/
│       └── page.tsx                  (Warranty Policy)
├── page.tsx                          (update: add LegalBanner)

components/
├── legal-banner.tsx                  (new: warning banner)
├── footer.tsx                        (update: add Legal column)
```

---

## Task 1: Create Legal Layout with Shared Styles

**Files:**
- Create: `app/legal/layout.tsx`

**Interfaces:**
- Produces: `LegalLayout` component (Server Component)
  - Props: `{ children: React.ReactNode }`
  - Provides: consistent styling, table of contents wrapper, breadcrumb

- [ ] **Step 1: Create the legal layout file**

Create `app/legal/layout.tsx` with shared styling for all legal pages:

```tsx
import type { ReactNode } from 'react'

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container px-4 md:px-6 mx-auto py-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <a href="/" className="text-[#3b82f6] hover:underline">
                  Inicio
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-600">Información Legal</li>
            </ol>
          </div>
        </nav>

        {/* Legal Content */}
        <article className="container px-4 md:px-6 mx-auto py-12 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            {children}
          </div>
        </article>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Verify file was created**

Run:
```bash
ls -la app/legal/
```

Expected: File `layout.tsx` exists in `app/legal/`

---

## Task 2: Create Términos y Condiciones Page

**Files:**
- Create: `app/legal/terminos-condiciones/page.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from Task 1
- Produces: `/legal/terminos-condiciones` page with metadata, h1 title, TOC with jump links, 8 sections

- [ ] **Step 1: Create the page file**

Create `app/legal/terminos-condiciones/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify page loads**

Run: `npm run dev`

Navigate to: `http://localhost:3000/legal/terminos-condiciones`

Expected: Page loads with proper layout, TOC with working jump links, 8 sections visible

---

## Task 3: Create Aviso Legal Page

**Files:**
- Create: `app/legal/aviso-legal/page.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from Task 1
- Produces: `/legal/aviso-legal` page with 5 sections covering identity, brand disclaimers, product quality, liability waiver

- [ ] **Step 1: Create the page file**

Create `app/legal/aviso-legal/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify page loads**

Navigate to: `http://localhost:3000/legal/aviso-legal`

Expected: Page loads with proper layout, 5 sections visible, yellow warning box in Section 2

---

## Task 4: Create Precios y Servicios FAQ Page

**Files:**
- Create: `app/legal/precios-servicios/page.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from Task 1
- Produces: `/legal/precios-servicios` page with 5 Q&A pairs in FAQ format

- [ ] **Step 1: Create the page file**

Create `app/legal/precios-servicios/page.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precios y Servicios - FAQ | Yesmos Celulares',
  description: 'Preguntas frecuentes sobre nuestros precios mayoristas, servicios de reparación y cotizaciones.',
}

export default function PreciosServicios() {
  const faqs = [
    {
      question: '¿Por qué tienen dos precios diferentes?',
      answer: 'Yesmos Celulares opera bajo un modelo de negocio dual. Somos distribuidor mayorista de refacciones para reparadores profesionales en la región, y también ofrecemos servicio de reparación directo al público general. Por eso tenemos precios mayoristas (para reparadores) y precios al público (para clientes finales que usan el cotizador).',
      id: 'q1',
    },
    {
      question: '¿Cuáles son exactamente mis precios?',
      answer: 'Los precios mostrados en la página de inicio (home) son tarifa mayorista exclusiva para reparadores profesionales. Los precios al público se encuentran en nuestro cotizador. Si eres cliente final, usa el cotizador para ver los precios que pagará. Si eres reparador profesional, usa los precios de la home.',
      id: 'q2',
    },
    {
      question: '¿Puedo comprar como cliente final usando los precios de la home?',
      answer: 'No. Los precios de la home están reservados para reparadores profesionales. Como cliente final, debes usar nuestro cotizador para obtener una cotización con precios al público. Si intentas comprar directamente con precios mayoristas, la solicitud será evaluada y se puede rechazar o procesar al precio correspondiente.',
      id: 'q3',
    },
    {
      question: '¿Hacen envíos a otras ciudades o estados?',
      answer: 'Yesmos Celulares opera principalmente en Sahuayo, Michoacán. Para consultas sobre surtido, envíos o abastecimiento a otras regiones (especialmente para reparadores profesionales), contacta directamente vía WhatsApp: +52 353 184 4881. Evaluaremos cada caso según disponibilidad y logística.',
      id: 'q4',
    },
    {
      question: '¿Qué pasa si compro siendo no-reparador en la sección de mayorista?',
      answer: 'No es el flujo diseñado. Sin embargo, puedes contactarnos vía WhatsApp para una cotización personalizada. Podemos evaluar tu solicitud y ofrecerte opciones. La mejor opción para clientes finales es siempre usar nuestro cotizador en /cotizaciones.',
      id: 'q5',
    },
  ]

  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Precios y Servicios - Preguntas Frecuentes</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
        <p className="text-gray-700">
          Aquí respondemos las preguntas más frecuentes sobre nuestros precios, modelos de negocio y servicios. Si tu pregunta no está listada, contacta vía WhatsApp.
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((faq) => (
          <div key={faq.id} className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {faq.question}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 bg-[#3b82f6] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">¿Tienes otra pregunta?</h2>
        <p className="mb-6">Contacta directamente vía WhatsApp para consultas específicas sobre precios o servicios.</p>
        <a
          href="https://wa.me/523531844881"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-white text-[#3b82f6] px-8 font-bold hover:bg-gray-100 transition-all"
        >
          Chat en WhatsApp
        </a>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <p className="text-sm text-gray-600">
          Última actualización: {new Date().toLocaleDateString('es-MX')}
        </p>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify page loads**

Navigate to: `http://localhost:3000/legal/precios-servicios`

Expected: Page loads with 5 FAQ items in blue boxes, WhatsApp CTA button visible

---

## Task 5: Create Política de Garantía Page

**Files:**
- Create: `app/legal/garantia/page.tsx`

**Interfaces:**
- Consumes: `LegalLayout` from Task 1
- Produces: `/legal/garantia` page with warranty details for products and services

- [ ] **Step 1: Create the page file**

Create `app/legal/garantia/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify page loads**

Navigate to: `http://localhost:3000/legal/garantia`

Expected: Page loads with 3 sections, green/red warning boxes, clear warranty requirements

---

## Task 6: Create Legal Banner Component

**Files:**
- Create: `components/legal-banner.tsx`

**Interfaces:**
- Produces: `LegalBanner` component (Server Component)
  - Props: none (static)
  - Returns: JSX for warning banner with red background, white text, CTA link

- [ ] **Step 1: Create the component**

Create `components/legal-banner.tsx`:

```tsx
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export function LegalBanner() {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-red-600 shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">
              ⚠️ IMPORTANTE: Precios Mayoristas
            </h3>
            <p className="text-red-800 mb-4">
              Los precios mostrados arriba son tarifa <strong>mayorista exclusiva para reparadores profesionales</strong> de la región.
            </p>
            <p className="text-red-800 mb-4">
              ¿Eres cliente final? Usa nuestro cotizador para ver precios al público.
            </p>
            <Link
              href="/cotizaciones"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 text-white px-6 font-semibold hover:bg-red-700 transition-colors"
            >
              Ver precios al público →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify component syntax is correct**

Run: `npm run lint`

Expected: No errors, file passes linting

---

## Task 7: Update Home Page to Include Banner

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `LegalBanner` from Task 6
- Produces: Updated home with banner inserted after `ProductCatalog`

- [ ] **Step 1: Read the current home page**

```bash
# File already read in context, check current structure
```

- [ ] **Step 2: Update app/page.tsx to import and use LegalBanner**

```tsx
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductCatalog } from "@/components/product-catalog"
import { LegalBanner } from "@/components/legal-banner"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Yesmos Celulares | Catálogo en Línea",
  description: "Refacciones, celulares y servicio técnico en Sahuayo.",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      <Header />
      <main className="flex-1">
        <ProductCatalog />
        
        {/* NEW: Legal banner warning about wholesale pricing */}
        <div className="container px-4 md:px-6 mx-auto">
          <LegalBanner />
        </div>

        <Hero />
        
        <ServicesSection />

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-[#3b82f6] text-white" id="contacto">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">
              ¿Necesitas soporte técnico?
            </h2>
            <p className="max-w-[600px] mx-auto text-blue-100 mb-8">
              Contáctanos directamente para cotizaciones especiales o dudas sobre refacciones.
            </p>
            <a
              rel="noopener noreferrer"
              href="https://wa.me/523531844881"
              target="_blank"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#3b82f6] px-8 font-bold shadow-lg hover:bg-gray-100 transition-all"
            >
              Chat en WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Verify home page renders with banner**

Run in browser: `http://localhost:3000/`

Expected: Banner appears below ProductCatalog with red background, warning text, and "Ver precios al público" button

---

## Task 8: Update Footer with Legal Links

**Files:**
- Modify: `components/footer.tsx`

**Interfaces:**
- Consumes: existing footer structure
- Produces: updated footer with new "Legal" column containing 4 links to legal pages

- [ ] **Step 1: Read current footer file to understand structure**

File already read in context. Current structure has 4 columns: Yesmos.com, Enlaces Rápidos, Servicios, Contacto.

- [ ] **Step 2: Update footer.tsx to add Legal column**

Update `components/footer.tsx`:

```tsx
import Link from "next/link"
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#3b82f6]">Yesmos.com</h3>
            <p className="text-gray-400 text-sm">
              Tu aliado confiable en tecnología móvil. Venta, reparación y refacciones de la más alta calidad en
              Sahuayo.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/share/16TwD7pnDJ/" className="text-gray-400 hover:text-[#3b82f6] transition-colors">
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

          {/* NEW: Legal column */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/legal/terminos-condiciones" className="hover:text-[#3b82f6] transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/legal/aviso-legal" className="hover:text-[#3b82f6] transition-colors">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link href="/legal/precios-servicios" className="hover:text-[#3b82f6] transition-colors">
                  Precios y Servicios
                </Link>
              </li>
              <li>
                <Link href="/legal/garantia" className="hover:text-[#3b82f6] transition-colors">
                  Política de Garantía
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-[#3b82f6] shrink-0" />
                <span>Av. Constitución #206, Centro, Sahuayo, Michoacán</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#3b82f6] shrink-0" />
                <span>+52 353 184 4881</span>
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
```

- [ ] **Step 3: Verify footer renders correctly**

Refresh browser at: `http://localhost:3000/`

Scroll to footer. Expected:
- 5 columns visible (was 4)
- New "Legal" column with 4 links
- All links are functional and point to `/legal/*` pages

---

## Task 9: Full Site Testing and Verification

**Files:**
- Test all new pages and links

**Interfaces:**
- Validates: all 4 legal pages load, all links work, banner displays correctly, footer links are functional

- [ ] **Step 1: Test all legal page links in footer**

Navigate to: `http://localhost:3000/`

Click each link in footer "Legal" column:
- [ ] Términos y Condiciones → `/legal/terminos-condiciones`
- [ ] Aviso Legal → `/legal/aviso-legal`
- [ ] Precios y Servicios → `/legal/precios-servicios`
- [ ] Política de Garantía → `/legal/garantia`

Expected: Each page loads with proper layout, title, metadata, and content visible

- [ ] **Step 2: Test banner on home page**

Navigate to: `http://localhost:3000/`

Expected:
- Red banner visible below ProductCatalog
- Text reads: "⚠️ IMPORTANTE: Precios Mayoristas"
- Button "Ver precios al público →" is clickable
- Clicking button navigates to `/cotizaciones`

- [ ] **Step 3: Test jump links in TOC (Términos y Condiciones)**

Navigate to: `http://localhost:3000/legal/terminos-condiciones`

Click each link in "Índice":
- [ ] "1. Aceptación de Términos" → jumps to section #aceptacion
- [ ] "2. Descripción del Servicio" → jumps to section #descripcion
- [ ] All 8 sections have working jump links

Expected: Page scrolls to correct section when clicking TOC link

- [ ] **Step 4: Test responsive design on mobile**

Using browser DevTools, set viewport to mobile (375px width):

Expected:
- All pages render properly on mobile
- Banner text is readable
- Footer columns stack vertically
- No horizontal scrolling needed

- [ ] **Step 5: Test metadata in browser**

Right-click on page → View Page Source

Verify in `<head>`:
- Each page has correct `<title>` tag
- Each page has correct `<meta name="description">` tag

Example for `/legal/terminos-condiciones`:
```html
<title>Términos y Condiciones | Yesmos Celulares</title>
<meta name="description" content="Lee nuestros términos...">
```

- [ ] **Step 6: Run lint check**

```bash
npm run lint
```

Expected: No errors or warnings

---

## Task 10: Final Commit

**Files:**
- All new files and modifications

**Interfaces:**
- Creates: git commit with all legal compliance changes

- [ ] **Step 1: Check git status**

```bash
git status
```

Expected output shows:
- New files: `components/legal-banner.tsx`
- New files: `app/legal/layout.tsx`, `app/legal/terminos-condiciones/page.tsx`, etc.
- Modified: `app/page.tsx`, `components/footer.tsx`

- [ ] **Step 2: Stage all changes**

```bash
git add components/legal-banner.tsx
git add app/legal/
git add app/page.tsx
git add components/footer.tsx
```

- [ ] **Step 3: Create commit**

```bash
git commit -m "feat: Add complete legal compliance pages (T&C, legal notice, FAQ, warranty policy) + warning banner

- Create /app/legal/ directory structure with shared layout
- Add Términos y Condiciones page with 8 sections
- Add Aviso Legal page with brand disclaimers
- Add Precios y Servicios FAQ page
- Add Política de Garantía page with warranty details
- Create LegalBanner component with warning about wholesale pricing
- Update home page to display warning banner below ProductCatalog
- Update footer with new Legal column containing 4 links
- All pages include proper SEO metadata and responsive design

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Verify commit**

```bash
git log --oneline -1
```

Expected: Latest commit shows the legal compliance feature with all details

---

## Summary

This plan creates a complete legal compliance structure for Yesmos Celulares:

✅ **4 legal pages** fully implemented with proper content
✅ **Warning banner** on home page clarifying wholesale vs. retail pricing
✅ **Footer links** organized under new Legal column
✅ **SEO metadata** for all pages
✅ **Responsive design** for mobile and desktop
✅ **All tests passing** - pages load, links work, design is consistent

**Total implementation time:** ~2-3 hours for experienced React developer

**Key deliverables:**
- Legal clarity on pricing model
- Professional legal structure
- Protection from future disputes
- Better user experience (clear pricing expectations)
