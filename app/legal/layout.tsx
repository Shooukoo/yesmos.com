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
