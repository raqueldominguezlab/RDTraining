import { NextRequest } from 'next/server'
import { createCipheriv, createHmac } from 'crypto'

// ── Configuración servidor (NUNCA exponer al cliente) ─────────────────────
// Variables de entorno necesarias en .env:
//   REDSYS_SECRET_KEY   → Clave secreta del panel Santander TPV (Base64)
//   REDSYS_FUC          → Código de comercio
//   REDSYS_TERMINAL     → Terminal (normalmente "1")
//   REDSYS_ENVIRONMENT  → "test" | "production"
//   NEXT_PUBLIC_SITE_URL → URL raíz del sitio
// ─────────────────────────────────────────────────────────────────────────

const SECRET_KEY = process.env.REDSYS_SECRET_KEY ?? ''
const FUC        = process.env.REDSYS_FUC ?? ''
const TERMINAL   = process.env.REDSYS_TERMINAL ?? '1'
const IS_PROD    = process.env.REDSYS_ENVIRONMENT === 'production'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rdtraining.es";

const REDSYS_URL = IS_PROD
  ? 'https://sis.redsys.es/sis/realizarPago'
  : 'https://sis-t.redsys.es:25443/sis/realizarPago'

// ── Helpers de firma (HMAC_SHA256_V1) ─────────────────────────────────────

function encrypt3DES(data: string, key: Buffer): Buffer {
  const iv = Buffer.alloc(8, 0)
  const messageBuf = Buffer.from(data, 'utf8')
  // Zero-pad to 8-byte block boundary (Redsys requires zero-padding, NOT PKCS#7)
  const paddedLen = Math.ceil(messageBuf.length / 8) * 8
  const paddedBuf = Buffer.alloc(paddedLen, 0)
  messageBuf.copy(paddedBuf)
  const cipher = createCipheriv('des-ede3-cbc', key, iv)
  cipher.setAutoPadding(false)
  return Buffer.concat([cipher.update(paddedBuf), cipher.final()])
}

function createSignature(orderNumber: string, merchantParamsB64: string): string {
  const keyDecoded = Buffer.from(SECRET_KEY, 'base64')
  const diversifiedKey = encrypt3DES(orderNumber, keyDecoded)
  const hmac = createHmac('sha256', diversifiedKey)
  hmac.update(merchantParamsB64)
  return hmac.digest('base64')
}

// ── POST /api/payment ─────────────────────────────────────────────────────
// Devuelve los datos firmados para el formulario de redirección a Redsys.

export async function POST(req: NextRequest) {
  if (!SECRET_KEY || !FUC) {
    return Response.json(
      { error: 'Payment gateway not configured' },
      { status: 503 },
    )
  }

  let body: { orderNumber: string; amountCents: number; servicio?: string; locale?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { orderNumber, amountCents, servicio, locale } = body

  if (!orderNumber || !amountCents || amountCents <= 0) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!/^\d{4}[A-Za-z0-9]{1,8}$/.test(orderNumber)) {
    return Response.json({ error: 'Invalid order number format' }, { status: 400 })
  }

  const contactParams = new URLSearchParams()
  if (servicio) contactParams.set('servicio', servicio)
  contactParams.set('paymentCompleted', 'true')
  if (locale) contactParams.set('locale', locale)
  const contactQuery = contactParams.toString()

  const merchantParams: Record<string, string> = {
    DS_MERCHANT_AMOUNT:          String(Math.round(amountCents)),
    DS_MERCHANT_ORDER:           orderNumber,
    DS_MERCHANT_MERCHANTCODE:    FUC,
    DS_MERCHANT_CURRENCY:        '978',
    DS_MERCHANT_TRANSACTIONTYPE: '0',
    DS_MERCHANT_TERMINAL:        TERMINAL,
    DS_MERCHANT_MERCHANTURL:     `${SITE_URL}/api/payment/notification`,
    DS_MERCHANT_URLOK:           `${SITE_URL}/contacto?${contactQuery}`,
    DS_MERCHANT_URLKO:           `${SITE_URL}/pago/error`,
  }

  if (servicio) {
    merchantParams.DS_MERCHANT_PRODUCTDESCRIPTION = servicio.slice(0, 125)
  }

  const merchantParamsB64 = Buffer.from(JSON.stringify(merchantParams)).toString('base64')
  const signature = createSignature(orderNumber, merchantParamsB64)

  return Response.json({
    redsysUrl:            REDSYS_URL,
    Ds_SignatureVersion:  'HMAC_SHA256_V1',
    Ds_MerchantParameters: merchantParamsB64,
    Ds_Signature:          signature,
  })
}
