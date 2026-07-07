import type { Metadata } from 'next'
import { Suspense } from 'react'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contacta con Rocío Domínguez para comenzar tu entrenamiento personalizado. Primera sesión gratuita.',
  openGraph: {
    title: 'Contacto | Rocío Domínguez',
    description: 'Contacta con Rocío Domínguez para comenzar tu entrenamiento personalizado. Primera sesión gratuita.',
  },
  twitter: {
    title: 'Contacto | Rocío Domínguez',
    description: 'Contacta con Rocío Domínguez para comenzar tu entrenamiento personalizado. Primera sesión gratuita.',
  },
}

export default function ContactoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" />
      </div>
    }>
      <ContactContent />
    </Suspense>
  )
}
