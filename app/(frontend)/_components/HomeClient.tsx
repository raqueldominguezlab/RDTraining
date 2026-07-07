'use client'

import { useState, useEffect } from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import HeroClient from './HeroClient'
import AboutSection from './AboutSection'
import ServicesClient from './ServicesClient'
import GalleryClient from './GalleryClient'
import BestForYouClient from './BestForYouClient'

type HeroData = {
  heroImage: string
  heroMimeType: string
  statements: Array<{ statement: any }>
  ctaText: string
  ctaLink: string
  ctaSecondaryText?: string
  ctaSecondaryLink?: string
  badgeText?: string
  scrollText?: string
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
  featured?: boolean
  image?: {
    url: string
    alt?: string
  }
}

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

type HomeClientProps = {
  heroDataEs: HeroData
  heroDataEn: HeroData
  servicesEs: Service[]
  servicesEn: Service[]
  productsEs: Product[]
  productsEn: Product[]
  aboutSectionEs: {
    title: string
    subtitle: string
    photo?: { url: string; alt: string }
    biography: SerializedEditorState
    philosophyPillars: Array<{ icon: string; title: string; description: string }>
    certifications: Array<{ name: string; year?: number }>
  }
  aboutSectionEn: {
    title: string
    subtitle: string
    photo?: { url: string; alt: string }
    biography: SerializedEditorState
    philosophyPillars: Array<{ icon: string; title: string; description: string }>
    certifications: Array<{ name: string; year?: number }>
  }
  bestForYouEs: {
    sectionTitle: string
    sectionSubtitle?: string
    tabs: Array<{ tabTitle: string; image: { url: string; alt?: string }; url: string }>
  }
  bestForYouEn: {
    sectionTitle: string
    sectionSubtitle?: string
    tabs: Array<{ tabTitle: string; image: { url: string; alt?: string }; url: string }>
  }
  galleryEs: {
    sectionTitle?: string
    images: Array<{ url: string; alt?: string }>
  }
  galleryEn: {
    sectionTitle?: string
    images: Array<{ url: string; alt?: string }>
  }
}

export default function HomeClient({ 
  heroDataEs, 
  heroDataEn,
  servicesEs,
  servicesEn,
  productsEs,
  productsEn,
  aboutSectionEs,
  aboutSectionEn,
  bestForYouEs,
  bestForYouEn,
  galleryEs,
  galleryEn
}: HomeClientProps) {
  const [locale, setLocale] = useState<'es' | 'en'>('es')

  useEffect(() => {
    const stored = localStorage.getItem('locale')
    if (stored === 'en' || stored === 'es') {
      setLocale(stored)
    }
  }, [])

  const handleLocaleChange = (newLocale: 'es' | 'en') => {
    setLocale(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
    }
  }

  return (
    <div className="w-full">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => handleLocaleChange('es')}
          className={`px-1.5 rounded font-semibold transition-all text-4xl cursor-pointer ${
            locale === 'es'
              ? 'bg-accent-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          🇪🇸
        </button>
        <button
          onClick={() => handleLocaleChange('en')}
          className={`px-1.5 rounded font-semibold transition-all text-4xl cursor-pointer ${
            locale === 'en'
              ? 'bg-accent-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          🇬🇧
        </button>
      </div>

      {/* Content */}
      <HeroClient data={locale === 'es' ? heroDataEs : heroDataEn} />
      <AboutSection  aboutData={locale === 'es' ? aboutSectionEs : aboutSectionEn} />
      <ServicesClient
        id="servicios"
        services={locale === 'es' ? servicesEs : servicesEn}
        products={locale === 'es' ? productsEs : productsEn}
        locale={locale}
      />
      <GalleryClient data={locale === 'es' ? galleryEs : galleryEn} />
      {/* <BestForYouClient data={locale === 'es' ? bestForYouEs : bestForYouEn} locale={locale} /> */}
    </div>
  )
}
