import type { CollectionConfig } from 'payload'

// Archivos digitales (PDFs) de los productos de pago único. Nunca públicos:
// se almacenan en un bucket R2 privado (ver payload.config.ts) y solo se
// sirven a través de app/api/products/download tras validar un pedido pagado.
export const ProductFiles: CollectionConfig = {
  slug: 'product-files',
  access: {
    read: ({ req }) => Boolean(req.user),
  },
  upload: {
    mimeTypes: ['application/pdf'],
    staticDir: './product-files',
  },
  fields: [],
}
