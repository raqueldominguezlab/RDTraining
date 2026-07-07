import type { CollectionConfig } from 'payload'

// Productos digitales de pago único (ej. ebooks en PDF), vendidos vía Redsys
// y entregados por email tras confirmación de pago. Ver app/api/products/*.
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priceCents', 'active', 'updatedAt'],
  },
  access: {
    read: () => true, // Público (necesario para mostrar el producto en la home)
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL amigable del producto (ej: hyrox-8-semanas)',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Descripción breve del producto (1-2 líneas)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Imagen de portada del producto (opcional)',
      },
    },
    {
      name: 'priceCents',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Precio en céntimos de euro (ej. 5000 = 50,00€). Es la única fuente del precio: el servidor nunca confía en un importe enviado por el cliente.',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'product-files',
      required: true,
      admin: {
        description: 'El PDF que se entrega tras el pago (almacenado en bucket privado, nunca público)',
      },
    },
    {
      name: 'deliveryEmailSubject',
      type: 'text',
      localized: true,
      defaultValue: 'Tu descarga ya está lista 🎉',
      admin: {
        description: 'Asunto del email de entrega tras el pago',
      },
    },
    {
      name: 'deliveryEmailBody',
      type: 'textarea',
      localized: true,
      defaultValue: 'Gracias por tu compra. Aquí tienes tu enlace de descarga.',
      admin: {
        description: 'Texto introductorio del email de entrega (el enlace de descarga se añade automáticamente)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Mostrar este producto en el sitio',
      },
    },
  ],
  timestamps: true,
}
