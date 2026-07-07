'use client'

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
  id?: string
  locale?: 'es' | 'en'
}

export default function ServicesClient({ services, id, locale = 'es' }: ServicesClientProps) {
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
        </div>

        {/* Empty State */}
        {services.length === 0 && (
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
