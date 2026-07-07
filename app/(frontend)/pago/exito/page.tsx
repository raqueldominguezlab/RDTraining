import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pago completado – RDTraining',
  robots: { index: false, follow: false },
}

// Fallback landing shown by Redsys URLOK redirect (when InSite flow fails to
// handle the response client-side). In the happy path the user never reaches
// this page directly — PagoContent handles success inline.
export default function PagoExitoPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Pago completado!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Tu pago se ha procesado correctamente. Te enviaremos la confirmación por email en breve.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}
