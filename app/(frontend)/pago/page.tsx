import type { Metadata } from 'next'
import { Suspense } from 'react'
import PagoContent from './PagoContent'

export const metadata: Metadata = {
  title: 'Completar pago | RDTraining',
  description: 'Completa el pago de tu servicio de entrenamiento personalizado con RDTraining.',
  robots: { index: false, follow: false },
}

export default function PagoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" />
      </div>
    }>
      <PagoContent />
    </Suspense>
  )
}
