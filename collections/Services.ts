import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'featured', 'updatedAt'],
  },
  access: {
    read: () => true, // Público
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
        description: 'URL amigable para el servicio (ej: premium-one-to-one)',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Descripción breve del servicio (1-2 líneas)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Imagen representativa del servicio (opcional)',
      },
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      localized: true,
      minRows: 1,
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'included',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Si está desactivado, la feature aparece en gris (no incluida)',
          },
        },
      ],
      admin: {
        description: 'Características principales del servicio',
      },
    },
    {
      name: 'price',
      type: 'group',
      fields: [
        {
          name: 'amount',
          type: 'number',
          admin: {
            description: 'Precio del servicio (opcional)',
          },
        },
        {
          name: 'currency',
          type: 'select',
          options: ['EUR', 'USD', 'GBP'],
          defaultValue: 'EUR',
        },
        {
          name: 'period',
          type: 'select',
          options: [
            { label: 'Mensual', value: 'monthly' },
            { label: 'Trimestral', value: 'quarterly' },
            { label: 'Anual', value: 'yearly' },
            { label: 'Por sesión', value: 'per-session' },
            { label: 'Bajo consulta', value: 'on-request' },
          ],
          defaultValue: 'monthly',
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
      defaultValue: 'Más información',
      admin: {
        description: 'Texto del botón de acción',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        description: 'URL del botón de acción (ej: /contacto?servicio=premium). Si se deja vacío, se usará /contacto con el nombre del servicio.',
      },
    },
    {
      name: 'ctaOpenInNewTab',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Abrir el enlace del botón en una pestaña nueva',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Destacar este servicio',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Orden de visualización (menor número = primero)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Mostrar este servicio en el sitio',
      },
    },
  ],
  timestamps: true,
}
