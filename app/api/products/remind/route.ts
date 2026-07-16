import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'

// Recordatorio de compra sin terminar. Lo ejecuta el cron de Vercel una vez
// al día (ver vercel.json). Busca pedidos pending/failed de hace más de 24h
// (y menos de 14 días), sin recordatorio previo, cuyo comprador no haya
// llegado a pagar ese producto por otra vía, y les envía un único email.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rdtraining-serviciosunicos.vercel.app'
const MIN_AGE_MS = 24 * 60 * 60 * 1000
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000
const BATCH = 50

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const payload: any = await getPayload({ config })
  const resend = new Resend(process.env.RESEND_API_KEY)
  const emailFrom = process.env.PRODUCT_EMAIL_FROM || 'noreply@rdtraining.es'

  const now = Date.now()
  const result = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { status: { in: ['pending', 'failed'] } },
        { reminderSentAt: { exists: false } },
        { createdAt: { less_than: new Date(now - MIN_AGE_MS).toISOString() } },
        { createdAt: { greater_than: new Date(now - MAX_AGE_MS).toISOString() } },
      ],
    },
    depth: 1,
    limit: BATCH,
    sort: 'createdAt',
  })

  let sent = 0
  let skipped = 0
  const notified = new Set<string>()

  for (const order of result.docs) {
    const email: string = order.email || ''
    const product = typeof order.product === 'object' ? order.product : null
    const productId = product?.id ?? order.product
    const key = `${email}|${productId}`

    const markReminded = () =>
      payload.update({ collection: 'orders', id: order.id, data: { reminderSentAt: new Date().toISOString() } })

    // descartar emails de prueba y duplicados dentro del mismo lote
    if (!email || email.endsWith('@example.com') || notified.has(key)) {
      await markReminded()
      skipped++
      continue
    }

    // si ese email ya compró este producto, no recordar
    const paid = await payload.find({
      collection: 'orders',
      where: {
        and: [{ email: { equals: email } }, { product: { equals: productId } }, { status: { equals: 'paid' } }],
      },
      limit: 1,
    })
    if (paid.docs.length > 0) {
      await markReminded()
      skipped++
      continue
    }

    const title = product ? String(product.title) : 'tu programa HYROX'
    const { error } = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: `Tu compra de "${title}" se quedó a medias 🏃‍♀️`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
          <h2>¿Lo terminamos?</h2>
          <p>Vimos que empezaste la compra de <strong>${title}</strong> y el pago
          no llegó a completarse.</p>
          <p>Si quieres terminarla, aquí lo tienes:</p>
          <p style="margin:28px 0">
            <a href="${SITE_URL}/servicios"
               style="background:#111;color:#fff;padding:14px 24px;
                      text-decoration:none;border-radius:6px;display:inline-block">
              Completar mi compra
            </a>
          </p>
          <p style="color:#666;font-size:13px">¿Tuviste algún problema con el pago?
          Responde a este correo y te ayudamos.</p>
          <p style="color:#666;font-size:13px">Si ya no te interesa, puedes ignorar
          este mensaje: no volveremos a escribirte sobre este pedido.</p>
        </div>
      `,
    })

    if (error) {
      console.error('[Remind] Error enviando a', email, error.message)
      continue // sin marcar: se reintentará mañana
    }
    await markReminded()
    notified.add(key)
    sent++
  }

  console.log(`[Remind] enviados=${sent} omitidos=${skipped} candidatos=${result.docs.length}`)
  return NextResponse.json({ sent, skipped, candidates: result.docs.length })
}
