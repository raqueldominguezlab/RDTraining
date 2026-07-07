import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createPrivateDownloadUrl } from '@/utils/privateStorage'

const MAX_DOWNLOADS = 5

// GET /api/products/download?token=... — único punto de entrada al PDF.
// Nunca se expone la URL real del bucket: se valida el pedido pagado y se
// redirige a una URL firmada de 60s generada al momento.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''

  if (!token) {
    return new NextResponse('Enlace no válido', { status: 400 })
  }

  const payload: any = await getPayload({ config })

  const result = await payload.find({
    collection: 'orders',
    where: { downloadToken: { equals: token } },
    limit: 1,
  })
  const order = result.docs[0]

  if (!order || order.status !== 'paid') {
    return new NextResponse('Enlace no válido', { status: 403 })
  }

  if (!order.downloadExpiresAt || new Date(order.downloadExpiresAt).getTime() < Date.now()) {
    return new NextResponse(
      'Este enlace ha caducado. Responde al email de compra y te enviamos uno nuevo.',
      { status: 410 }
    )
  }

  if ((order.downloadCount ?? 0) >= MAX_DOWNLOADS) {
    return new NextResponse(
      'Has superado el número de descargas permitidas para este enlace. Responde al email de compra si necesitas ayuda.',
      { status: 403 }
    )
  }

  const productId = typeof order.product === 'object' ? order.product.id : order.product
  const product = await payload.findByID({ collection: 'products', id: productId, depth: 1 })
  const file = product.file
  const fileDoc = typeof file === 'object' ? file : null

  if (!fileDoc?.filename) {
    console.error('[Products Download] Producto sin archivo asociado:', productId)
    return new NextResponse('Archivo no disponible, contacta con soporte.', { status: 500 })
  }

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: { downloadCount: (order.downloadCount ?? 0) + 1 },
  })

  const objectKey = `product-files/${fileDoc.filename}`
  const downloadFilename = `${String(product.title).replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'descarga'}.pdf`
  const presignedUrl = await createPrivateDownloadUrl(objectKey, downloadFilename, 60)

  return NextResponse.redirect(presignedUrl, { status: 302 })
}
