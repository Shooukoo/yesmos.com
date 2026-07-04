# Diseño: Compliance Legal para Yesmos Celulares

**Fecha:** 2026-07-04  
**Objetivo:** Implementar estructura legal completa (Términos y Condiciones, Aviso Legal, FAQ de Precios, Política de Garantía) para proteger el negocio y evitar confusiones sobre precios mayoristas vs. retail.

**Problema:** Cliente interpretó precios de home (mayoristas para reparadores) como precios al público. Falta claridad legal completa en el sitio.

---

## 1. Visión General

Crear 4 páginas legales nuevas en `/app/legal/` + agregar banner de advertencia en home + mejorar footer con links legales. Esto clarifica el modelo de negocio y protege legalmente el negocio.

---

## 2. Estructura de Páginas

### 2.1 Página: Términos y Condiciones (`/legal/terminos-condiciones`)

**Secciones:**
1. Aceptación de términos
2. Servicio de reparación (proceso, responsabilidad, tiempo estimado)
3. Venta de refacciones (descripción, calidad "compatible no original")
4. Devoluciones y cambios (plazo 7 días, condiciones, proceso)
5. Garantía (ver Sección 2.4 para detalles)
6. Limitación de responsabilidad (no responsable por daños indirectos, pérdida de datos)
7. Contacto legal (nombre legal, RFC, dirección)

**Tono:** Formal pero accesible en español

---

### 2.2 Página: Aviso Legal (`/legal/aviso-legal`)

**Secciones:**
1. Identidad del negocio ("Yesmos Celulares opera como [nombre legal]")
2. Disclaimer de marcas (clarificar que no eres distribuidor oficial de Apple, Samsung, OPPO, Huawei, Honor, ZTE, etc.)
3. Calidad de productos (especificar: "refacciones de alta calidad compatible, no originales de marca directa")
4. Exención de responsabilidad (errores en precios, disponibilidad, descripciones)
5. Uso de logos/nombres (referencias informativamente, no como endorso)

**Tono:** Formal, claro y directo

---

### 2.3 Página: Precios y Servicios FAQ (`/legal/precios-servicios`)

**Preguntas clave:**
- ¿Por qué dos precios diferentes?
- ¿Cuáles son tus precios? (home = mayorista | cotizador = retail)
- ¿Puedo comprar como cliente final en la home?
- ¿Hacen envíos?
- ¿Qué pasa si compro sin ser reparador?

**Tono:** Conversacional, FAQ estilo Q&A

---

### 2.4 Página: Política de Garantía (`/legal/garantia`)

**Garantía de Refacciones:**
- Cubrimos defectos de fabricación por 30 días
- **Requisitos:** pieza intacta, sin pegamento, sin roturas, sellos de garantía intactos
- Si no se cumplen requisitos, no aplica cambio/devolución

**Garantía de Servicio de Reparación:**
- **Pantallas:** No hay garantía
- **Otras reparaciones:** Cubre defectos en el trabajo realizado por 15 días
- **Requisitos:** equipo no manipulado por terceros, sin daños adicionales, mismas condiciones al entregar
- **No cubre:** daño por mal uso, caídas, agua, manipulación externa

**Proceso:** Contactar vía WhatsApp con comprobante + descripción del problema

**Tono:** Claro y específico (protege el negocio)

---

## 3. Cambios en Home

### 3.1 Banner de Advertencia

**Ubicación:** Justo debajo de `ProductCatalog` (antes de `Hero`)

**Contenido:**
```
⚠️ IMPORTANTE: Precios Mayoristas

Los precios mostrados arriba son tarifa mayorista exclusiva para 
reparadores profesionales de la región.

¿Eres cliente final? Usa nuestro cotizador para ver precios al público.
```

**Diseño:**
- Fondo: `bg-red-50`
- Borde izquierdo: `border-l-4 border-red-500`
- Texto: `text-red-900`
- Botón CTA: "Ver precios al público →" → `/cotizaciones`
- Responsive, accesible

### 3.2 Footer Mejorado

Nueva columna "Legal" con links:
- Términos y Condiciones
- Aviso Legal
- Precios y Servicios
- Política de Garantía

Cada link va a `/legal/[página]`

---

## 4. Estructura Técnica

### 4.1 Archivos a crear

```
app/
├── legal/
│   ├── layout.tsx              (layout compartido + estilos)
│   ├── terminos-condiciones/
│   │   └── page.tsx
│   ├── aviso-legal/
│   │   └── page.tsx
│   ├── precios-servicios/
│   │   └── page.tsx
│   └── garantia/
│       └── page.tsx

components/
├── legal-banner.tsx            (banner de precios mayoristas)
```

### 4.2 Componentes

**LegalBanner.tsx**
- Banner reutilizable con advertencia de precios mayoristas
- Props: ninguno (estático en home)
- Importado en `app/page.tsx`

**legal/layout.tsx**
- Layout compartido para todas las páginas legales
- Incluye: tabla de contenidos, estilos consistentes, metadata
- Hereda de root layout

### 4.3 Detalles de implementación

- Cada página legal:
  - Título h1
  - Tabla de contenidos con links internos (jump links)
  - Secciones numeradas (h2)
  - Responsive, buen contraste, accesible
  - Metadata SEO (title, description para cada página)

- Footer: agregar columna "Legal" en `components/footer.tsx`

- Home (`app/page.tsx`):
  - Importar `LegalBanner`
  - Insertar después de `ProductCatalog`

---

## 5. Contenido Detallado

### 5.1 Términos y Condiciones (esquema)

```
1. Aceptación
   - Al usar este sitio aceptas estos términos

2. Descripción del Servicio
   - Venta de refacciones y servicio de reparación
   - Modelo: mayorista (reparadores) + retail (clientes finales)

3. Servicio de Reparación
   - Proceso general
   - Tiempo estimado (variable)
   - Responsabilidad: no responsables de robo/daño una vez entregado
   - Cliente responsable de recoger en tiempo acordado

4. Venta de Refacciones
   - Descripción: "alta calidad compatible, no originales de marca"
   - Disponibilidad: sujeta a cambios sin previo aviso
   - Precios: sujetos a cambios

5. Devoluciones y Cambios
   - Plazo: 7 días desde compra
   - Condiciones: producto sin usar, en empaque original, sellos intactos
   - Proceso: contactar vía WhatsApp

6. Garantía
   - Remitir a `/legal/garantia` para detalles completos

7. Limitación de Responsabilidad
   - No responsables por daños indirectos
   - No responsables por pérdida de datos
   - No responsables por daños causados por terceros

8. Contacto Legal
   - Nombre legal: [completar con datos reales]
   - RFC: [completar]
   - Dirección: Av. Constitución #206, Centro, Sahuayo, Michoacán
   - Email: contacto@yesmos.com
   - Teléfono: +52 353 184 4881
```

### 5.2 Aviso Legal (esquema)

```
1. Identidad
   - Nombre legal del negocio
   - Ubicación

2. Disclaimer de Marcas
   "No somos distribuidor oficial de Apple, Samsung, OPPO, Huawei, 
   Honor, ZTE ni otras marcas. Los nombres y logos son propiedad 
   intelectual de sus respectivos dueños. Usamos estas referencias 
   solo informativamente para describir compatibilidad."

3. Calidad de Productos
   "Ofrecemos refacciones de alta calidad compatible, no originales 
   fabricadas directamente por los fabricantes de marca. Ofrecemos 
   la mejor calidad disponible en el mercado regional."

4. Exención de Responsabilidad
   - Errores en precios (somos responsables de corregirlos)
   - Disponibilidad de productos
   - Descripciones de productos
   - Acceso/disponibilidad del sitio

5. Cambios en el Sitio
   - Nos reservamos derecho a cambiar contenido sin previo aviso
```

### 5.3 Precios y Servicios FAQ (esquema)

```
P: ¿Por qué dos precios diferentes?
R: Operamos como distribuidor mayorista para reparadores (home) 
   y también ofrecemos servicio de reparación directo al público (cotizador).

P: ¿Cuáles son tus precios?
R: Home = tarifa mayorista para reparadores profesionales
   Cotizador = precios al público final

P: ¿Puedo comprar como cliente final en la home?
R: No, pero puedes usar nuestro cotizador en /cotizaciones 
   o contactarnos por WhatsApp.

P: ¿Hacen envíos?
R: Operamos localmente en Sahuayo. Para consultas de envío/surtido 
   a otras regiones, contacta vía WhatsApp.

P: ¿Qué pasa si compro como no-reparador en la home?
R: No es el flujo diseñado, pero puedes intentar contactarnos 
   por WhatsApp para cotización personalizada.
```

### 5.4 Política de Garantía (esquema - ya detallado en Sección 2.4)

---

## 6. Componentes React

### 6.1 `LegalBanner.tsx`

```tsx
// Componente simple, no interactivo
export function LegalBanner() {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
      <div className="flex items-start gap-4">
        <AlertTriangle className="text-red-600 shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-red-900 mb-2">
            IMPORTANTE: Precios Mayoristas
          </h3>
          <p className="text-red-800 mb-4">
            Los precios mostrados arriba son tarifa mayorista exclusiva para 
            reparadores profesionales de la región.
          </p>
          <a href="/cotizaciones" className="inline-block">
            Ver precios al público →
          </a>
        </div>
      </div>
    </div>
  )
}
```

### 6.2 `legal/layout.tsx`

```tsx
// Layout compartido con:
// - Estilos consistentes (max-width, padding, tipografía)
// - Tabla de contenidos (generada dinámicamente si es posible, o estática)
// - Metadata heredada
// - Breadcrumb de navegación
```

---

## 7. SEO y Metadata

Cada página legal tendrá:

| Página | Title | Description |
|--------|-------|-------------|
| T&C | "Términos y Condiciones \| Yesmos Celulares" | "Lee nuestros términos y condiciones para compra de refacciones y servicio de reparación de celulares." |
| Aviso Legal | "Aviso Legal \| Yesmos Celulares" | "Información legal, disclaimers de marcas y responsabilidades de Yesmos Celulares." |
| Precios/Servicios | "Precios y Servicios - FAQ \| Yesmos Celulares" | "Preguntas frecuentes sobre nuestros precios mayoristas, servicios de reparación y cotizaciones." |
| Garantía | "Política de Garantía \| Yesmos Celulares" | "Detalles de garantía para refacciones y servicios de reparación en Yesmos Celulares." |

---

## 8. Checklist de Implementación

- [ ] Crear estructura de carpetas `/app/legal/`
- [ ] Escribir contenido para cada página
- [ ] Crear `LegalBanner.tsx`
- [ ] Crear `legal/layout.tsx`
- [ ] Crear 4 pages.tsx en cada subcarpeta
- [ ] Agregar metadata SEO a cada página
- [ ] Integrar banner en home (`app/page.tsx`)
- [ ] Actualizar footer con links legales
- [ ] Revisar responsive en mobile
- [ ] Testing: verificar que todos los links funcionen
- [ ] Revisar redacción legal (opcional: consultar abogado en México)

---

## 9. Consideraciones

1. **Consulta legal:** Este spec contiene estructura y lenguaje general. Se recomienda que un abogado en Michoacán/México revise los términos finales para asegurar cumplimiento total con leyes locales (PROFECO, LSPDCP si aplica, etc.).

2. **Datos legales faltantes:** El spec deja placeholders para nombre legal, RFC — necesarios en Términos y Aviso Legal.

3. **Política de devoluciones:** El spec sugiere 7 días, pero tú puedes ajustar este plazo.

4. **WhatsApp como canal principal:** Todas las garantías y consultas van vía WhatsApp — esto está reflejado en el contenido.

5. **Scalabilidad:** La estructura es modular. En el futuro se pueden agregar más páginas (Política de Privacidad, etc.) sin mayor cambio.

---

## 10. Referencias

- Ubicación de home: `app/page.tsx`
- Ubicación de footer: `components/footer.tsx`
- Cotizador: `app/cotizaciones/page.tsx`
- Datos de contacto en metadata: `app/layout.tsx`
