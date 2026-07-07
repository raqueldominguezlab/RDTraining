import { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyRedsysSignature } from '@/utils/redsysSignature'
import { sendProductDeliveryEmail } from '@/utils/sendProductDeliveryEmail'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rdtraining.es'
const DOWNLOAD_EXPIRY_MS = 72 * 60 * 60 * 1000 // 72h
const MAX_DOWNLOADS = 5

// POST /api/products/notify — webhook servidor-a-servidor de Redsys.
// AQUÍ (y solo aquí) se confirma la venta y se dispara el email con el PDF.
// La página /gracias-programa es solo visual y no concede acceso al archivo.
export async function POST(req: NextRequest) {
  if (!process.env.REDSYS_SECRET_KEY) {
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

  const orderId = decoded.Ds_Order ?? ''
  if (!verifyRedsysSignature(orderId, merchantParamsB64, signatureReceived)) {
    console.error('[Products Notification] Invalid signature for order:', orderId)
    return new Response('Invalid signature', { status: 403 })
  }

  const payload: any = await getPayload({ config })

  const result = await payload.find({
    collection: 'orders',
    where: { orderId: { equals: orderId } },
    limit: 1,
  })
  const order = result.docs[0]

  if (!order) {
    console.error('[Products Notification] Order not found:', orderId)
    return new Response('Order not found', { status: 404 })
  }

  // Idempotencia: si Redsys reenvía la notificación de un pedido ya pagado,
  // no reenviamos el email ni regeneramos el token.
  if (order.status === 'paid') {
    return new Response('OK', { status: 200 })
  }

  const dsResponse = Number(decoded.Ds_Response ?? 9999)
  const approved = dsResponse >= 0 && dsResponse <= 99

  if (!approved) {
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { status: 'failed' },
    })
    console.log(`[Products Notification] ❌ Order ${orderId} denied (code ${dsResponse})`)
    return new Response('OK', { status: 200 })
  }

  const downloadToken = randomBytes(32).toString('base64url')
  const downloadExpiresAt = new Date(Date.now() + DOWNLOAD_EXPIRY_MS).toISOString()

  const productId = typeof order.product === 'object' ? order.product.id : order.product
  const product = await payload.findByID({ collection: 'products', id: productId })

  const downloadUrl = `${SITE_URL}/api/products/download?token=${downloadToken}`
  const emailResult = await sendProductDeliveryEmail({
    to: order.email,
    productTitle: String(product.title),
    subject: product.deliveryEmailSubject,
    introText: product.deliveryEmailBody,
    downloadUrl,
    orderId,
  })

  if (!emailResult.success) {
    // No marcamos como pagado si el email falla: Redsys reintentará la
    // notificación y lo intentaremos de nuevo.
    console.error('[Products Notification] Error enviando email de entrega:', emailResult.error)
    return new Response('Email error', { status: 500 })
  }

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      status: 'paid',
      downloadToken,
      downloadExpiresAt,
      downloadCount: 0,
    },
  })

  console.log(`[Products Notification] ✅ Order ${orderId} approved and delivered (max ${MAX_DOWNLOADS} downloads)`)
  return new Response('OK', { status: 200 })
}
