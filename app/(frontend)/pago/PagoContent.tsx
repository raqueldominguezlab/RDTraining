'use client'

import { useCallback, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function generateOrderNumber(): string {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')
  return `${mm}${dd}${random}`
}

type Status = 'idle' | 'loading' | 'error'

const t = {
  es: {
    back: 'Volver a servicios',
    title: 'Pago seguro',
    subtitle: 'Serás redirigido a la pasarela segura de Santander para completar el pago',
    serviceLabel: 'Servicio',
    amountLabel: 'Total a pagar',
    payButton: 'Pagar',
    loading: 'Redirigiendo a pasarela de pago...',
    errorTitle: 'Error al iniciar el pago',
    errorDesc: 'No hemos podido conectar con la pasarela de pago. Inténtalo de nuevo.',
    retryButton: 'Intentar de nuevo',
    securePayment: 'Pago seguro con',
    noAmountDesc: 'Este servicio requiere consulta previa. Contáctanos para conocer el precio exacto.',
    contactButton: 'Contactar',
  },
  en: {
    back: 'Back to services',
    title: 'Secure payment',
    subtitle: 'You will be redirected to the secure Santander payment gateway',
    serviceLabel: 'Service',
    amountLabel: 'Total to pay',
    payButton: 'Pay',
    loading: 'Redirecting to payment gateway...',
    errorTitle: 'Error starting payment',
    errorDesc: "We couldn't connect to the payment gateway. Please try again.",
    retryButton: 'Try again',
    securePayment: 'Secure payment with',
    noAmountDesc: 'This service requires prior consultation. Contact us for the exact price.',
    contactButton: 'Contact us',
  },
} as const

export default function PagoContent() {
  const searchParams = useSearchParams()
  const servicio    = searchParams.get('servicio') || ''
  const amountStr   = searchParams.get('amount') || ''
  const localeParam = searchParams.get('locale')

  const [locale] = useState<'es' | 'en'>(() => {
    if (localeParam === 'en' || localeParam === 'es') return localeParam
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('locale')
      if (stored === 'en' || stored === 'es') return stored
    }
    return 'es'
  })

  const amountEuros     = parseFloat(amountStr)
  const hasAmount       = !isNaN(amountEuros) && amountEuros > 0
  const amountFormatted = hasAmount
    ? new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
        style: 'currency',
        currency: 'EUR',
      }).format(amountEuros)
    : ''

  const [status, setStatus] = useState<Status>('idle')
  const orderRef = useRef(generateOrderNumber())
  const tr = t[locale]

  const handlePay = useCallback(async () => {
    if (!hasAmount) return
    setStatus('loading')

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderRef.current,
          amountCents: Math.round(amountEuros * 100),
          servicio: servicio || undefined,
          locale,
        }),
      })

      if (!res.ok) {
        setStatus('error')
        return
      }

      const data = (await res.json()) as {
        redsysUrl: string
        Ds_SignatureVersion: string
        Ds_MerchantParameters: string
        Ds_Signature: string
      }

      // Create hidden form and auto-submit to Redsys
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.redsysUrl

      const fields: Record<string, string> = {
        Ds_SignatureVersion:   data.Ds_SignatureVersion,
        Ds_MerchantParameters: data.Ds_MerchantParameters,
        Ds_Signature:          data.Ds_Signature,
      }

      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement('input')
        input.type  = 'hidden'
        input.name  = name
        input.value = value
        form.appendChild(input)
      }

      document.body.appendChild(form)
      form.submit()
    } catch {
      setStatus('error')
    }
  }, [hasAmount, amountEuros, servicio])

  const handleRetry = useCallback(() => {
    orderRef.current = generateOrderNumber()
    setStatus('idle')
  }, [])

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-16">
      <div className="max-w-lg mx-auto">
        <Link
          href="/#servicios"
          className="inline-flex items-center text-accent-500 hover:text-accent-600 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {tr.back}
        </Link>

        {/* ── ERROR ───────────────────────────────────────────────── */}
        {status === 'error' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tr.errorTitle}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{tr.errorDesc}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {tr.retryButton}
            </button>
          </div>
        )}

        {/* ── PAYMENT SUMMARY (idle + loading) ──────────────────────── */}
        {(status === 'idle' || status === 'loading') && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Card header */}
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 px-8 py-6 text-white">
              <h1 className="text-2xl font-bold mb-1">{tr.title}</h1>
              <p className="text-white/80 text-sm">{tr.subtitle}</p>
            </div>

            <div className="p-8 space-y-6">
              {/* Service + price summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                {servicio && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{tr.serviceLabel}</span>
                    <span className="font-semibold text-gray-900 dark:text-white truncate ml-4 max-w-[60%] text-right">
                      {servicio}
                    </span>
                  </div>
                )}
                {hasAmount && (
                  <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{tr.amountLabel}</span>
                    <span className="text-2xl font-bold text-accent-500">{amountFormatted}</span>
                  </div>
                )}
                {!hasAmount && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tr.noAmountDesc}</p>
                )}
              </div>

              {/* Pay button or loading */}
              {hasAmount && (
                <>
                  {status === 'idle' && (
                    <button
                      onClick={handlePay}
                      className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
                    >
                      {tr.payButton} {amountFormatted}
                    </button>
                  )}

                  {status === 'loading' && (
                    <div className="flex items-center justify-center gap-3 py-3">
                      <svg className="w-5 h-5 animate-spin text-accent-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="text-sm text-gray-500">{tr.loading}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    {tr.securePayment} Redsys / Santander
                  </div>
                </>
              )}

              {/* No amount: contact CTA */}
              {!hasAmount && (
                <Link
                  href={`/contacto${servicio ? `?servicio=${encodeURIComponent(servicio)}&locale=${locale}` : ''}`}
                  className="block w-full text-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {tr.contactButton}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
