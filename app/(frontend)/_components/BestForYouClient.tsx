'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

type Tab = {
  tabTitle: string
  image: { url: string; alt?: string; mimeType?: string }
  url: string
}

type BestForYouData = {
  sectionTitle: string
  sectionSubtitle?: string
  tabs: Tab[]
}

const t = {
  es: { viewProduct: 'Ver producto →', affiliateLink: 'Enlace afiliado' },
  en: { viewProduct: 'View product →', affiliateLink: 'Affiliate link' },
}

export default function BestForYouClient({ data, locale = 'es' }: { data: BestForYouData; locale?: 'es' | 'en' }) {
  const [activeTab, setActiveTab] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const el = tabsRef.current[activeTab]
    if (el) {
      const parent = el.parentElement
      if (parent) {
        setIndicator({
          left: el.offsetLeft - (parent.offsetLeft + 5),
          width: el.offsetWidth + 10,
        })
      }
    }
  }, [activeTab])

  const handleTabChange = useCallback((index: number) => {
    if (index === activeTab) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTab(index)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(false))
      })
    }, 300)
  }, [activeTab])

  if (!data.tabs || data.tabs.length === 0) return null

  const currentTab = data.tabs[activeTab]
  const isVideo = currentTab?.image?.mimeType?.startsWith('video/')

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {data.sectionSubtitle && (
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-500 mb-2">
              {data.sectionSubtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {data.sectionTitle}
          </h2>
        </div>

        {/* Tabs */}
        <div className="relative mb-10">
          <div className="flex justify-center gap-6 sm:gap-10">
            {data.tabs.map((tab, index) => (
              <button
                key={index}
                ref={(el) => { tabsRef.current[index] = el }}
                onClick={() => handleTabChange(index)}
                className={`pb-3 text-sm sm:text-base font-medium transition-colors duration-300 ${
                  activeTab === index
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {tab.tabTitle}
              </button>
            ))}
          </div>
          {/* Full-width grey line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700" />
          {/* Active indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-accent-500 transition-all duration-500 ease-in-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </div>

        {/* Image or Video */}
        {currentTab && (
          <div className="flex justify-center perspective-[1200px]">
            <a
              href={currentTab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl group cursor-pointer"
              style={{
                transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms ease',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning
                  ? 'translateY(12px) scale(0.97) rotateX(2deg)'
                  : 'translateY(0) scale(1) rotateX(0deg)',
              }}
            >
              {isVideo ? (
                <video
                  src={currentTab.image.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-w-3xl max-h-[500px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <img
                  src={currentTab.image.url}
                  alt={currentTab.image.alt || currentTab.tabTitle}
                  className="w-full max-w-3xl max-h-[500px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg">
                  {t[locale].viewProduct}
                </span>
              </div>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
