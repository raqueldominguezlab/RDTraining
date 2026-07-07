import { createCipheriv, createHmac } from 'crypto'

// Firma Redsys (HMAC_SHA256_V1) para el flujo de productos de pago único.
// Copia deliberada de la lógica de app/api/payment/route.ts y
// app/api/payment/notification/route.ts: se mantiene aparte para no tocar ni
// arriesgar el flujo de pago de suscripciones que ya está en producción.

const SECRET_KEY = process.env.REDSYS_SECRET_KEY ?? ''

export function encrypt3DES(data: string, key: Buffer): Buffer {
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

export function createRedsysSignature(orderNumber: string, merchantParamsB64: string): string {
  const keyDecoded = Buffer.from(SECRET_KEY, 'base64')
  const diversifiedKey = encrypt3DES(orderNumber, keyDecoded)
  const hmac = createHmac('sha256', diversifiedKey)
  hmac.update(merchantParamsB64)
  return hmac.digest('base64')
}

export function verifyRedsysSignature(
  orderNumber: string,
  merchantParamsB64: string,
  signatureReceived: string
): boolean {
  const keyDecoded = Buffer.from(SECRET_KEY, 'base64')
  const diversifiedKey = encrypt3DES(orderNumber, keyDecoded)
  const hmac = createHmac('sha256', diversifiedKey)
  hmac.update(merchantParamsB64)
  const expected = hmac.digest('base64')

  // Redsys uses URL-safe base64 in notifications — normalize both before comparing
  const normalize = (s: string) => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return normalize(expected) === normalize(signatureReceived)
}

export function redsysGatewayUrl(): string {
  const isProd = process.env.REDSYS_ENVIRONMENT === 'production'
  return isProd
    ? 'https://sis.redsys.es/sis/realizarPago'
    : 'https://sis-t.redsys.es:25443/sis/realizarPago'
}

/**
 * Número de pedido válido para Redsys: 12 caracteres, los 4 primeros
 * numéricos (MMDD) + 8 alfanuméricos aleatorios. Mismo formato que ya usa
 * generateOrderNumber() en app/(frontend)/pago/PagoContent.tsx.
 */
export function generateProductOrderNumber(): string {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `${mm}${dd}${random}`
}
