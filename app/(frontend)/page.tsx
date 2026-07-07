import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeClient from "./_components/HomeClient"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config })

  try {
    const homeHero: any = await (payload as any).findGlobal({
      slug: 'home-hero',
      locale: 'es',
    })

    const heroImage = typeof homeHero?.heroImage === 'object' && homeHero?.heroImage?.url
      ? homeHero.heroImage
      : null

    return {
      openGraph: {
        ...(heroImage?.url && {
          images: [{
            url: heroImage.url,
            width: heroImage.width || 1200,
            height: heroImage.height || 630,
            alt: heroImage.alt || 'Rocío Domínguez - Entrenamiento Personalizado',
          }],
        }),
      },
      twitter: {
        ...(heroImage?.url && {
          images: [heroImage.url],
        }),
      },
    }
  } catch {
    return {}
  }
}

export default async function Home() {
  const payload = await getPayload({ config })
  
  // Fetch data for both locales
  const [heroDataEs, heroDataEn, servicesEs, servicesEn, aboutSectionEs, aboutSectionEn, bestForYouEs, bestForYouEn, galleryEs, galleryEn] = await Promise.all([
    fetchHeroData(payload, 'es'),
    fetchHeroData(payload, 'en'),
    fetchServices(payload, 'es'),
    fetchServices(payload, 'en'),
    fetchAboutSection(payload, 'es'),
    fetchAboutSection(payload, 'en'),
    fetchBestForYou(payload, 'es'),
    fetchBestForYou(payload, 'en'),
    fetchGallery(payload, 'es'),
    fetchGallery(payload, 'en'),
  ])
  
  return (
    <HomeClient 
      heroDataEs={heroDataEs} 
      heroDataEn={heroDataEn}
      servicesEs={servicesEs}
      servicesEn={servicesEn}
      aboutSectionEs={aboutSectionEs}
      aboutSectionEn={aboutSectionEn}
      bestForYouEs={bestForYouEs}
      bestForYouEn={bestForYouEn}
      galleryEs={galleryEs}
      galleryEn={galleryEn}
    />
  )
}

async function fetchHeroData(payload: any, locale: 'es' | 'en') {
  const defaultStatements = locale === 'es'
    ? [
        {
          statement: {
            root: {
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: 'Tu cuerpo ', format: 0 },
                    { type: 'text', text: 'SÍ puede', format: 1 },
                    { type: 'text', text: ' conquistar los 8km', format: 0 },
                  ],
                },
              ],
            },
          },
        },
        {
          statement: {
            root: {
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: 'Tu mente ', format: 0 },
                    { type: 'text', text: 'SÍ puede', format: 1 },
                    { type: 'text', text: ' superar el wall ball', format: 0 },
                  ],
                },
              ],
            },
          },
        },
      ]
    : [
        {
          statement: {
            root: {
              children: [
                {
                  type: 'paragraph',
                  children: [
                    { type: 'text', text: 'Your body ', format: 0 },
                    { type: 'text', text: 'CAN', format: 1 },
                    { type: 'text', text: ' conquer the 8km', format: 0 },
                  ],
                },
              ],
            },
          },
        },
      ]

  try {
    const homeHero: any = await (payload as any).findGlobal({
      slug: 'home-hero',
      locale: locale,
    })

    const heroMedia = typeof homeHero?.heroImage === 'object' && homeHero?.heroImage?.url
      ? homeHero.heroImage
      : null

    return {
      heroImage: heroMedia?.url || '/images/hero-placeholder.jpg',
      heroMimeType: heroMedia?.mimeType || '',
      statements: homeHero?.statements?.length > 0 ? homeHero.statements : defaultStatements,
      ctaText: homeHero?.ctaText || (locale === 'es' ? 'Entrena conmigo GRATIS' : 'Train with me FREE'),
      ctaLink: homeHero?.ctaLink || '#contacto',
      ctaSecondaryText: homeHero?.ctaSecondaryText || undefined,
      ctaSecondaryLink: homeHero?.ctaSecondaryLink || undefined,
      badgeText: homeHero?.badgeText || (locale === 'es' ? 'HYROX PERFORMANCE COACH' : 'HYROX PERFORMANCE COACH'),
      scrollText: homeHero?.scrollText || (locale === 'es' ? 'Descubre más' : 'Discover more'),
    }
  } catch (error) {
    console.error(`Error loading Hero data for locale ${locale}:`, error)
    return {
      heroImage: '/images/hero-placeholder.jpg',
      heroMimeType: '',
      statements: defaultStatements,
      ctaText: locale === 'es' ? 'Entrena conmigo GRATIS' : 'Train with me FREE',
      ctaLink: '#contacto',
      ctaSecondaryText: undefined,
      ctaSecondaryLink: undefined,
      badgeText: locale === 'es' ? 'HYROX PERFORMANCE COACH' : 'HYROX PERFORMANCE COACH',
      scrollText: locale === 'es' ? 'Descubre más' : 'Discover more',
    }
  }
}

async function fetchServices(payload: any, locale: 'es' | 'en') {
  try {
    const result = await payload.find({
      collection: 'services',
      where: {
        active: { equals: true },
      },
      sort: 'order',
      locale: locale,
      limit: 100,
    })

    return result.docs.map((service: any) => ({
      id: service.id,
      title: service.title,
      shortDescription: service.shortDescription,
      icon: service.icon,
      features: (service.features || []).map((f: any) => ({
        feature: f.feature,
        included: f.included !== false,
        id: f.id,
      })),
      price: service.price,
      ctaText: service.ctaText,
      ctaLink: service.ctaLink,
      ctaOpenInNewTab: service.ctaOpenInNewTab,
      featured: service.featured,
      image: service.image?.url ? {
        url: service.image.url,
        alt: service.image.alt || service.title,
      } : undefined,
    }))
  } catch (error) {
    console.error(`Error loading Services for locale ${locale}:`, error)
    return []
  }
}

async function fetchAboutSection(payload: any, locale: 'es' | 'en') {
  try {
    const section = await (payload as any).findGlobal({
      slug: 'about-section',
      locale: locale,
    })
    
    return {
      title: section?.title || 'Mi Historia',
      subtitle: section?.subtitle || '',
      photo: section?.photo?.url ? {
        url: section.photo.url,
        alt: section.photo.alt || 'Foto de Rocío',
      } : undefined,
      biography: section?.biography || {},
      philosophyPillars: section?.philosophyPillars || [],
      certifications: section?.certifications || [],
    }
  } catch (error) {
    console.error(`Error loading AboutSection for locale ${locale}:`, error)
    return {
      title: 'Mi Historia',
      subtitle: '',
      photo: undefined,
      biography: {},
      philosophyPillars: [],
      certifications: [],
    }
  }
}

async function fetchBestForYou(payload: any, locale: 'es' | 'en') {
  const defaults = {
    sectionTitle: locale === 'es' ? 'Lo mejor para ti' : 'The best for you',
    sectionSubtitle: undefined as string | undefined,
    tabs: [] as Array<{ tabTitle: string; image: { url: string; alt?: string; mimeType?: string }; url: string }>,
  }

  try {
    const section = await (payload as any).findGlobal({
      slug: 'best-for-you',
      locale: locale,
    })

    return {
      sectionTitle: section?.sectionTitle || defaults.sectionTitle,
      sectionSubtitle: section?.sectionSubtitle || undefined,
      tabs: (section?.tabs || []).map((tab: any) => ({
        tabTitle: tab.tabTitle || '',
        image: tab.image?.url
          ? { url: tab.image.url, alt: tab.image.alt || tab.tabTitle, mimeType: tab.image.mimeType }
          : { url: '', alt: '' },
        url: tab.url || '#',
      })),
    }
  } catch (error) {
    console.error(`Error loading BestForYou for locale ${locale}:`, error)
    return defaults
  }
}

async function fetchGallery(payload: any, locale: 'es' | 'en') {
  const defaults = {
    sectionTitle: undefined as string | undefined,
    images: [] as Array<{ url: string; alt?: string }>,
  }

  try {
    const section = await (payload as any).findGlobal({
      slug: 'gallery',
      locale: locale,
    })

    return {
      sectionTitle: section?.sectionTitle || undefined,
      images: (section?.images || [])
        .map((item: any) => item.image?.url ? { url: item.image.url, alt: item.image.alt } : null)
        .filter(Boolean),
    }
  } catch (error) {
    console.error(`Error loading Gallery for locale ${locale}:`, error)
    return defaults
  }
}
