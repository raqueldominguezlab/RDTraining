import type { GlobalConfig } from 'payload'

export const BestForYou: GlobalConfig = {
  slug: 'best-for-you',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Título de la sección (ej: "Lo mejor para ti")',
      },
    },
    {
      name: 'sectionSubtitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Subtítulo opcional de la sección',
      },
    },
    {
      name: 'tabs',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'tabTitle',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Nombre del tab (ej: "Suplementos", "Equipamiento")',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Imagen del producto/afiliado a mostrar',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'URL externa del producto afiliado (se abre en nueva pestaña)',
          },
        },
      ],
      admin: {
        description: 'Tabs con imagen y enlace de afiliado (máximo 3)',
      },
    },
  ],
}
