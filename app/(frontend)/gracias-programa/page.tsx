import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pago completado – RDTraining',
  robots: { index: false, follow: false },
}

// Página puramente visual mostrada tras el redirect URLOK de Redsys. NO
// concede acceso al PDF: la entrega real ocurre en app/api/products/notify
// (webhook servidor-a-servidor), que es la única confirmación fiable.
export default function GraciasProgramaPage() {
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
          Tu pago se ha procesado correctamente. En unos minutos recibirás un email con el enlace
          de descarga — revisa también la carpeta de spam.
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
