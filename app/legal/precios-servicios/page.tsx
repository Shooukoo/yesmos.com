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
