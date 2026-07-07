'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import ContactForm from '../_components/ContactForm'

export default function ContactContent() {
  const searchParams = useSearchParams()
  const servicio = searchParams.get('servicio') || ''
  const amount = searchParams.get('amount') || ''
  const localeParam = searchParams.get('locale')
  const paymentCompleted = searchParams.get('paymentCompleted') === 'true'
  const [locale, setLocale] = useState<'es' | 'en'>('es')

  useEffect(() => {
    if (localeParam === 'en' || localeParam === 'es') {
      setLocale(localeParam)
    } else {
      // Fallback: read from localStorage (set by HomeClient language switcher)
      const stored = localStorage.getItem('locale')
      if (stored === 'en' || stored === 'es') {
        setLocale(stored)
      } else {
        const browserLang = navigator.language?.slice(0, 2)
        setLocale(browserLang === 'en' ? 'en' : 'es')
      }
    }
  }, [localeParam])

  return <ContactForm servicio={servicio} amount={amount} locale={locale} paymentCompleted={paymentCompleted} />
}
