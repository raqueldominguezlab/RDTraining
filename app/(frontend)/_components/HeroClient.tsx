'use client'

import { useState, useEffect, useRef } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { heroRichTextConverters } from '@/utils/richTextConverters'

interface HeroStatement {
  statement: SerializedEditorState
}

interface HeroData {
  heroImage: string
  heroMimeType: string
  statements: HeroStatement[]
  ctaText: string
  ctaLink: string
  ctaSecondaryText?: string
  ctaSecondaryLink?: string
  badgeText?: string
  scrollText?: string
}

export default function HeroClient({ data }: { data: HeroData }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentStatement, setCurrentStatement] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isVideo = data.heroMimeType?.startsWith('video/')

  useEffect(() => {
    // Trigger initial load animation
    const loadTimer = setTimeout(() => setIsLoaded(true), 100)

    // Statement carousel
    let interval: NodeJS.Timeout | undefined
    if (data.statements.length > 1) {
      interval = setInterval(() => {
        setCurrentStatement((prev) => (prev + 1) % data.statements.length)
      }, 4000)
    }

    return () => {
      clearTimeout(loadTimer)
      if (interval) clearInterval(interval)
    }
  }, [data.statements])

  const scrollToNext = () => {
    if (sectionRef.current) {
      const nextSection = sectionRef.current.nextElementSibling as HTMLElement
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[600px] max-h-[1200px] overflow-hidden"
    >
      {/* Background Media (Image or Video) */}
      <div className="absolute inset-0">
        {data.heroImage && data.heroImage !== '/images/hero-placeholder.jpg' ? (
          isVideo ? (
            <video
              ref={videoRef}
              src={data.heroImage}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-[center_50%]"
            />
          ) : (
            <img
              src={data.heroImage}
              alt="Hyrox Training"
              className="w-full h-full object-cover object-[center_35%]"
              loading="eager"
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        )}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="max-w-[60%] max-md:max-w-full">
            {/* Badge */}
            {data.badgeText && (
              <div
                className={`inline-flex items-center gap-2 mb-8 transition-all duration-700 ${
                  isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4'
                }`}
              >
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-accent-500/20 text-accent-300 border border-accent-500/30 backdrop-blur-sm">
                  {data.badgeText}
                </span>
              </div>
            )}

            {/* Empowering Statements */}
            <div className="space-y-2 md:space-y-3 mb-10 md:mb-14">
              {data.statements.length > 0 && (
                <div
                  key={currentStatement}
                  className={`transition-all duration-700 ease-out opacity-100 translate-x-0`}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] leading-[1.6] md:leading-[1.7] text-white/90 font-light tracking-wide">
                    <RichText
                      converters={heroRichTextConverters}
                      data={data.statements[currentStatement].statement}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-[1200ms] ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
            >
              {/* Primary CTA */}
              <a
                href={data.ctaLink || '#contacto'}
                className="group relative inline-flex items-center gap-3 bg-accent-500 hover:bg-accent-400 text-white font-bold text-base md:text-lg py-4 px-8 md:py-5 md:px-10 rounded-lg transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(70,187,194,0.3)] active:scale-[0.98]"
              >
                <span>{data.ctaText}</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-all duration-500 cursor-pointer ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '1.6s' }}
        aria-label="Scroll down"
      >
        {data.scrollText && (
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
            {data.scrollText}
          </span>
        )}
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </button>
    </section>
  )
}
