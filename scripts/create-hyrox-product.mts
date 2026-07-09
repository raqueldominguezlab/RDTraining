// Script puntual: crea el producto "Tu Próximo Hyrox en 8 Semanas" con su PDF
// (descargado del bucket privado) usando la API local de Payload.
// Uso: pnpm tsx scripts/create-hyrox-product.ts
import 'dotenv/config'
import { writeFile } from 'fs/promises'
import path from 'path'
import os from 'os'
import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { getPayload } from 'payload'
import config from '../payload.config.ts'

async function main() {
  const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_PRIVATE_ENDPOINT || '',
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_PRIVATE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_PRIVATE_SECRET_ACCESS_KEY || '',
    },
  })
  const bucket = process.env.R2_PRIVATE_BUCKET || ''

  const listed = await s3.send(new ListObjectsV2Command({ Bucket: bucket }))
  const pdfKey = (listed.Contents || []).map(o => o.Key || '').find(k => k.toLowerCase().endsWith('.pdf') && !k.startsWith('product-files/'))
  if (!pdfKey) throw new Error('No se encontró ningún PDF en la raíz del bucket privado')
  console.log('PDF origen:', pdfKey)

  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: pdfKey }))
  const bytes = await obj.Body!.transformToByteArray()
  const tmpPath = path.join(os.tmpdir(), 'Tu-Proximo-Hyrox-en-8-Semanas.pdf')
  await writeFile(tmpPath, Buffer.from(bytes))
  console.log('Descargado a', tmpPath, `(${(bytes.length / 1024 / 1024).toFixed(1)} MB)`)

  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'products' as any, where: { slug: { equals: 'hyrox-8-semanas' } }, limit: 1 })
  if (existing.docs.length > 0) {
    console.log('El producto ya existe, id:', existing.docs[0].id)
    process.exit(0)
  }

  const fileDoc = await payload.create({
    collection: 'product-files' as any,
    data: {},
    filePath: tmpPath,
  })
  console.log('product-files doc:', fileDoc.id, fileDoc.filename)

  const product = await payload.create({
    collection: 'products' as any,
    locale: 'es',
    data: {
      title: 'Tu Próximo Hyrox en 8 Semanas',
      slug: 'hyrox-8-semanas',
      shortDescription:
        'Tu plan completo de 8 semanas para preparar tu próximo Hyrox, sesión por sesión, con el simulacro incluido. Descarga en PDF.',
      priceCents: 100, // 1,00€ temporal para la compra de validación; luego se sube a 5000
      file: fileDoc.id,
      deliveryEmailSubject: 'Tu programa HYROX de 8 semanas 🏁',
      deliveryEmailBody:
        'Gracias por tu compra. Aquí tienes tu programa completo de 8 semanas, sesión por sesión, con el simulacro incluido.',
      active: true,
    },
  })
  console.log('Producto creado:', product.id, product.slug)
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
