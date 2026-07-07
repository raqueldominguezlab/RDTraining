import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pago no completado – RDTraining',
  robots: { index: false, follow: false },
}

// Fallback landing shown by Redsys URLKO redirect. In the normal InSite flow
// the error is handled inline; this page acts as a safety net.
export default function PagoErrorPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pago no completado</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          No hemos podido procesar tu pago. Comprueba los datos de tu tarjeta e inténtalo de nuevo.
          Si el problema persiste, contáctanos.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/#servicios"
            className="inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Intentar de nuevo
          </Link>
          <Link
            href="/"
            className="inline-block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}
