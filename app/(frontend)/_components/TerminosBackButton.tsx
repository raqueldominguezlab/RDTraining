'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function TerminosBackButton() {
  const searchParams = useSearchParams()
  const servicio = searchParams.get('servicio')
  
  const backLink = servicio ? `/contacto?servicio=${encodeURIComponent(servicio)}` : '/'
  const backText = servicio ? 'Volver al formulario' : 'Volver al inicio'

  return (
    <Link
      href={backLink}
      className="inline-flex items-center text-accent-500 hover:text-accent-600 mb-8 transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {backText}
    </Link>
  )
}
