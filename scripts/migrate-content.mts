// Migración puntual: copia Home Hero, About Section y Gallery (textos + media)
// desde la web antigua (rdominguezg.vercel.app, API pública de Payload) a la
// base de datos de este proyecto. NO copia Services (a propósito: esta web
// queda solo para productos de pago único).
// Uso: node --experimental-strip-types --experimental-transform-types scripts/migrate-content.mts
import 'dotenv/config'
import { writeFile } from 'fs/promises'
import path from 'path'
import os from 'os'
import { getPayload } from 'payload'
import config from '../payload.config.ts'

const OLD = 'https://rdominguezg.vercel.app'
const payload = await getPayload({ config })

const mediaMap = new Map<string | number, string | number>()

function stripIds(value: any): any {
  if (Array.isArray(value)) return value.map(stripIds)
  if (value && typeof value === 'object') {
    const out: any = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === 'id') continue
      out[k] = stripIds(v)
    }
    return out
  }
  return value
}

async function importMedia(oldDoc: any): Promise<string | number | null> {
  if (!oldDoc) return null
  const oldId = typeof oldDoc === 'object' ? oldDoc.id : oldDoc
  if (mediaMap.has(oldId)) return mediaMap.get(oldId)!
  if (typeof oldDoc !== 'object' || !oldDoc.url) {
    console.warn('  media sin URL, se omite:', oldId)
    return null
  }
  const url = oldDoc.url.startsWith('http') ? oldDoc.url : `${OLD}${oldDoc.url}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`No se pudo descargar ${url}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const tmp = path.join(os.tmpdir(), oldDoc.filename || `media-${oldId}`)
  await writeFile(tmp, buf)
  const created = await payload.create({
    collection: 'media' as any,
    data: { alt: oldDoc.alt || oldDoc.filename || 'imagen' },
    filePath: tmp,
  })
  console.log(`  media ${oldDoc.filename} (${(buf.length / 1024 / 1024).toFixed(1)} MB) -> id ${created.id}`)
  mediaMap.set(oldId, created.id)
  return created.id
}

async function fetchOld(slug: string, locale: string) {
  const res = await fetch(`${OLD}/api/globals/${slug}?depth=1&locale=${locale}&draft=false`)
  if (!res.ok) throw new Error(`${slug}/${locale}: ${res.status}`)
  return res.json()
}

// ── Home Hero ──────────────────────────────────────────────────────────────
console.log('Home Hero…')
{
  const es: any = await fetchOld('home-hero', 'es')
  const en: any = await fetchOld('home-hero', 'en')
  const heroImage = await importMedia(es.heroImage)
  await payload.updateGlobal({
    slug: 'home-hero' as any,
    locale: 'es',
    data: stripIds({
      heroImage,
      statements: es.statements,
      ctaText: es.ctaText,
      ctaLink: es.ctaLink,
      badgeText: es.badgeText,
      scrollText: es.scrollText,
    }),
  })
  await payload.updateGlobal({
    slug: 'home-hero' as any,
    locale: 'en',
    data: stripIds({
      statements: en.statements,
      ctaText: en.ctaText,
      badgeText: en.badgeText,
      scrollText: en.scrollText,
    }),
  })
  console.log('  ok')
}

// ── About Section ──────────────────────────────────────────────────────────
console.log('About Section…')
{
  const es: any = await fetchOld('about-section', 'es')
  const en: any = await fetchOld('about-section', 'en')
  const photo = await importMedia(es.photo)
  await payload.updateGlobal({
    slug: 'about-section' as any,
    locale: 'es',
    data: stripIds({ title: es.title, photo, biography: es.biography }),
  })
  if (en.title || en.biography) {
    await payload.updateGlobal({
      slug: 'about-section' as any,
      locale: 'en',
      data: stripIds({ title: en.title, biography: en.biography }),
    })
  }
  console.log('  ok')
}

// ── Gallery ────────────────────────────────────────────────────────────────
console.log('Gallery…')
{
  const es: any = await fetchOld('gallery', 'es')
  const en: any = await fetchOld('gallery', 'en')
  const images: any[] = []
  for (const item of es.images || []) {
    const newId = await importMedia(item.image)
    if (newId) images.push({ image: newId })
  }
  await payload.updateGlobal({
    slug: 'gallery' as any,
    locale: 'es',
    data: stripIds({ sectionTitle: es.sectionTitle, images }),
  })
  if (en.sectionTitle) {
    await payload.updateGlobal({ slug: 'gallery' as any, locale: 'en', data: { sectionTitle: en.sectionTitle } })
  }
  console.log('  ok')
}

console.log('Migración completada.')
process.exit(0)
