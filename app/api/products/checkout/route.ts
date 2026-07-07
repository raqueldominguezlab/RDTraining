import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  createRedsysSignature,
  generateProductOrderNumber,
  redsysGatewayUrl,
} from '@/utils/redsysSignature'

// ── Configuración servidor (NUNCA exponer al cliente) ─────────────────────
const FUC = process.env.REDSYS_FUC ?? ''
const TERMINAL = process.env.REDSYS_TERMINAL ?? '1'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rdtraining.es'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/products/checkout — inicia el pago de un producto de pago único.
// El precio SIEMPRE se lee del producto en Payload, nunca del cliente.
export async function POST(req: NextRequest) {
  if (!process.env.REDSYS_SECRET_KEY || !FUC) {
    return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 })
  }

  let body: { slug?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const slug = String(body.slug ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()

  if (!slug) {
    return NextResponse.json({ error: 'Falta el producto' }, { status: 400 })
  }
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
  }

  // payload-types.ts no incluye aún las colecciones nuevas (se regeneran con
  // `pnpm generate:types`); se usa `any` aquí igual que ya hace el resto del
  // proyecto (ver fetchServices/fetchProducts en app/(frontend)/page.tsx).
  const payload: any = await getPayload({ config })

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, active: { equals: true } },
    limit: 1,
  })
  const product = result.docs[0]

  if (!product) {
    return NextResponse.json({ error: 'Producto no disponible' }, { status: 404 })
  }

  const orderId = generateProductOrderNumber()

  await payload.create({
    collection: 'orders',
    data: {
      orderId,
      product: product.id,
      email,
      amountCents: product.priceCents,
      status: 'pending',
      downloadCount: 0,
    },
  })

  const merchantParams: Record<string, string> = {
    DS_MERCHANT_AMOUNT: String(Math.round(product.priceCents)),
    DS_MERCHANT_ORDER: orderId,
    DS_MERCHANT_MERCHANTCODE: FUC,
    DS_MERCHANT_CURRENCY: '978',
    DS_MERCHANT_TRANSACTIONTYPE: '0',
    DS_MERCHANT_TERMINAL: TERMINAL,
    DS_MERCHANT_MERCHANTURL: `${SITE_URL}/api/products/notify`,
    DS_MERCHANT_URLOK: `${SITE_URL}/gracias-programa`,
    DS_MERCHANT_URLKO: `${SITE_URL}/pago-programa-error`,
    DS_MERCHANT_PRODUCTDESCRIPTION: String(product.title).slice(0, 125),
  }

  const merchantParamsB64 = Buffer.from(JSON.stringify(merchantParams)).toString('base64')
  const signature = createRedsysSignature(orderId, merchantParamsB64)

  return NextResponse.json({
    redsysUrl: redsysGatewayUrl(),
    Ds_SignatureVersion: 'HMAC_SHA256_V1',
    Ds_MerchantParameters: merchantParamsB64,
    Ds_Signature: signature,
  })
}
