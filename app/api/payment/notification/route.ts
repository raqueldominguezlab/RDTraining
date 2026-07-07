import { NextRequest } from 'next/server'
import { createCipheriv, createHmac } from 'crypto'

// Redsys sends a POST notification (server-to-server) after the user completes
// (or fails) payment on their page. This endpoint verifies the signature and
// logs the result. Extend with your own business logic (update DB, send email…).

const SECRET_KEY = process.env.REDSYS_SECRET_KEY ?? ''

function encrypt3DES(data: string, key: Buffer): Buffer {
  const iv = Buffer.alloc(8, 0)
  const cipher = createCipheriv('des-ede3-cbc', key, iv)
  return Buffer.concat([cipher.update(Buffer.from(data, 'utf8')), cipher.final()])
}

function verifySignature(orderNumber: string, merchantParamsB64: string, signatureReceived: string): boolean {
  const keyDecoded = Buffer.from(SECRET_KEY, 'base64')
  const diversifiedKey = encrypt3DES(orderNumber, keyDecoded)
  const hmac = createHmac('sha256', diversifiedKey)
  hmac.update(merchantParamsB64)
  const expected = hmac.digest('base64')

  // Redsys uses URL-safe base64 in notifications — normalize both before comparing
  const normalize = (s: string) => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return normalize(expected) === normalize(signatureReceived)
}

export async function POST(req: NextRequest) {
  if (!SECRET_KEY) {
    return new Response('Not configured', { status: 503 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const merchantParamsB64 = formData.get('Ds_MerchantParameters') as string | null
  const signatureReceived = formData.get('Ds_Signature') as string | null

  if (!merchantParamsB64 || !signatureReceived) {
    return new Response('Missing fields', { status: 400 })
  }

  let decoded: Record<string, string>
  try {
    decoded = JSON.parse(Buffer.from(merchantParamsB64, 'base64').toString('utf8'))
  } catch {
    return new Response('Invalid params', { status: 400 })
  }

  const orderNumber = decoded.Ds_Order ?? ''
  if (!verifySignature(orderNumber, merchantParamsB64, signatureReceived)) {
    console.error('[Payment Notification] Invalid signature for order:', orderNumber)
    return new Response('Invalid signature', { status: 403 })
  }

  const dsResponse = Number(decoded.Ds_Response ?? 9999)
  const approved   = dsResponse >= 0 && dsResponse <= 99

  if (approved) {
    console.log(`[Payment Notification] ✅ Order ${orderNumber} approved (code ${dsResponse}, auth ${decoded.Ds_AuthorisationCode})`)
    // TODO: Update order status in database, send confirmation email, etc.
  } else {
    console.log(`[Payment Notification] ❌ Order ${orderNumber} denied (code ${dsResponse})`)
    // TODO: Mark order as failed
  }

  // Redsys expects HTTP 200 to acknowledge receipt
  return new Response('OK', { status: 200 })
}
