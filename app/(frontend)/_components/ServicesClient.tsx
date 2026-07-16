'use client'

import { useCallback, useState } from 'react'

type Product = {
  id: string
  slug: string
  title: string
  shortDescription: string
  priceCents: number
  image?: {
    url: string
    alt?: string
  }
}

type Service = {
  id: string
  title: string
  shortDescription: string
  icon: string
  features: Array<{ feature: string; included?: boolean; id?: string }>
  price?: {
    amount?: number
    currency?: string
    period?: string
    customText?: string
  }
  ctaText?: string
  ctaLink?: string
  ctaOpenInNewTab?: boolean
  featured?: boolean
  image?: {
    url: string
    alt?: string
  }
}

const iconMap: Record<string, string> = {
  muscle: '💪',
  running: '🏃',
  group: '👥',
  target: '🎯',
  energy: '⚡',
  trophy: '🏆',
  heart: '❤️',
  fire: '🔥',
}

interface ServicesClientProps {
  services: Service[]
  products?: Product[]
  id?: string
  locale?: 'es' | 'en'
}

export default function ServicesClient({ services, products = [], id, locale = 'es' }: ServicesClientProps) {
  const getPriceDisplay = (service: Service) => {
    if (service.price?.customText) {
      return service.price.customText
    }
    
    if (service.price?.amount) {
      const currencySymbol = service.price.currency === 'EUR' ? '€' : service.price.currency === 'USD' ? '$' : '£'
      const periodText: Record<string, string> = {
        monthly: '/mes',
        quarterly: '/trimestre',
        yearly: '/año',
        'per-session': '/sesión',
      }
      return `${service.price.amount}${currencySymbol}${periodText[service.price.period || 'monthly'] || ''}`
    }
    
    return null
  }

  return (
    <section id={id} className="w-full py-16 md:py-24 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col justify-between ${
                service.featured ? 'ring-2 ring-accent-500' : ''
              }`}
            >
              {/* Featured Badge */}
              {service.featured && (
                <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  Destacado
                </div>
              )}

              {/* Image or Icon */}
              {service.image?.url ? (
                <div className="aspect-[16/9] bg-gradient-to-br from-accent-400 to-accent-600 overflow-hidden flex items-center justify-center">
                  <img
                    src={service.image.url}
                    alt={service.image.alt || service.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                  <span className="text-7xl">{iconMap[service.icon] || '💪'}</span>
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.shortDescription}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((item, index) => {
                      const isIncluded = item.included !== false
                      return (
                        <li
                          key={item.id || index}
                          className={`flex items-start ${
                            isIncluded
                              ? 'text-gray-700 dark:text-gray-300'
                              : 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {isIncluded ? (
                            <svg
                              className="w-5 h-5 text-accent-500 mr-2 mt-0.5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-300 dark:text-gray-600 mr-2 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          )}
                          <span className={`text-sm ${!isIncluded ? 'line-through' : ''}`}>
                            {item.feature}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}

              </div>
              <div className="p-6 flex flex-col justify-end">
                {/* Price */}
                {getPriceDisplay(service) && (
                  <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                      {getPriceDisplay(service)}
                    </p>
                  </div>
                )}
                {/* CTA Button */}
                {service.ctaText && (
                  <a
                    href={(() => {
                      const base = service.ctaLink || `/pago?servicio=${encodeURIComponent(service.title)}${service.price?.amount ? `&amount=${service.price.amount}` : ''}`
                      const sep = base.includes('?') ? '&' : '?'
                      return `${base}${sep}locale=${locale}`
                    })()}
                    {...(service.ctaOpenInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="block w-full text-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {service.ctaText}
                  </a>
                )}
              </div>
            </div>
          ))}
          {products.map((product) => (
            <ProductBuyCard key={product.id} product={product} locale={locale} />
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Próximamente nuevos servicios...
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

const productText = {
  es: {
    emailPlaceholder: 'tu@email.com',
    buyButton: (price: string) => `Comprar — ${price}`,
    bizumButton: 'Pagar con Bizum',
    loading: 'Conectando con tu banco…',
    secure: 'Pago seguro con tarjeta o Bizum a través de Redsys. Recibirás el PDF en tu email al instante.',
    genericError: 'No se pudo iniciar el pago',
    unexpectedError: 'Error inesperado, inténtalo de nuevo',
  },
  en: {
    emailPlaceholder: 'you@email.com',
    buyButton: (price: string) => `Buy — ${price}`,
    bizumButton: 'Pay with Bizum',
    loading: 'Connecting to your bank…',
    secure: 'Secure payment by card or Bizum via Redsys. You will receive the PDF in your email instantly.',
    genericError: 'Could not start the payment',
    unexpectedError: 'Unexpected error, please try again',
  },
} as const

function ProductBuyCard({ product, locale }: { product: Product; locale: 'es' | 'en' }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const tr = productText[locale]

  const priceFormatted = new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.priceCents / 100)

  const handleBuy = useCallback(async (payMethod: 'card' | 'bizum' = 'card') => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/products/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: product.slug, email, payMethod }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? tr.genericError)
        setLoading(false)
        return
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.redsysUrl
      const fields: Record<string, string> = {
        Ds_SignatureVersion: data.Ds_SignatureVersion,
        Ds_MerchantParameters: data.Ds_MerchantParameters,
        Ds_Signature: data.Ds_Signature,
      }
      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value
        form.appendChild(input)
      }
      document.body.appendChild(form)
      form.submit()
    } catch {
      setError(tr.unexpectedError)
      setLoading(false)
    }
  }, [email, product.slug, tr])

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {product.image?.url ? (
        <div className="aspect-[16/9] bg-gradient-to-br from-accent-400 to-accent-600 overflow-hidden flex items-center justify-center">
          <img
            src={product.image.url}
            alt={product.image.alt || product.title}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
          <span className="text-7xl">📄</span>
        </div>
      )}

      <div className="p-6 flex-1">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{product.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{product.shortDescription}</p>
      </div>

      <div className="p-6 flex flex-col gap-3">
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">{priceFormatted}</p>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={tr.emailPlaceholder}
          autoComplete="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-base"
        />
        <button
          onClick={() => handleBuy('card')}
          disabled={loading || !email}
          className="w-full text-center bg-accent-500 hover:bg-accent-600 disabled:opacity-60 disabled:cursor-wait text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {loading ? tr.loading : tr.buyButton(priceFormatted)}
        </button>
        <button
          onClick={() => handleBuy('bizum')}
          disabled={loading || !email}
          className="w-full text-center bg-[#00c2c7] hover:bg-[#00aab0] disabled:opacity-60 disabled:cursor-wait text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {tr.bizumButton}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">{tr.secure}</p>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  )
}
