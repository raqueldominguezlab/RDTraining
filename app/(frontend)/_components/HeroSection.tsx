import { getPayload } from 'payload'
import config from '@payload-config'
import HeroClient from './HeroClient'

export default async function HeroSection({ locale = 'es' }: { locale?: 'es' | 'en' }) {
  const payload = await getPayload({ config })

  try {
    // Obtener datos del CMS
    const homeHero: any = await (payload as any).findGlobal({
      slug: 'home-hero',
      locale: locale,
    })

    // Preparar datos para el componente cliente
    const heroData = {
      heroImage: typeof homeHero?.heroImage === 'object' && homeHero?.heroImage?.url
        ? homeHero.heroImage.url
        : '/images/hero-placeholder.jpg',
      heroMimeType: typeof homeHero?.heroImage === 'object' ? homeHero.heroImage.mimeType : '',
      statements: homeHero?.statements || [],
      ctaText: homeHero?.ctaText || 'Entrena conmigo GRATIS',
      ctaLink: homeHero?.ctaLink || '#contacto',
      badgeText: homeHero?.badgeText || '',
      scrollText: homeHero?.scrollText || 'Descubre más',
    }

    console.log('Hero data from CMS:', heroData)
    return <HeroClient data={heroData} />
  } catch (error) {
    console.error('Error loading Hero data:', error)
    // Fallback con datos por defecto
    const defaultData = {
      heroImage: '/images/hero-placeholder.jpg',
      heroMimeType: '',
      statements: [{
        statement: {
          root: {
            type: 'root' as const,
            version: 1,
            direction: null,
            format: '' as const,
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  { type: 'text', text: 'Tu cuerpo ', format: 0, version: 1 },
                  { type: 'text', text: 'SÍ puede', format: 1, version: 1 },
                  { type: 'text', text: ' conquistar los 8km', format: 0, version: 1 },
                ],
              },
            ],
          },
        },
      }] as any,
      ctaText: 'Entrena conmigo GRATIS',
      ctaLink: '#contacto',
      badgeText: 'Especialista Hyrox',
      scrollText: 'Descubre más',
    }
    
    return <HeroClient data={defaultData} />
  }
}
