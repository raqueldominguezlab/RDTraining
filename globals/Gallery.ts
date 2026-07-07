import type { GlobalConfig } from 'payload'

export const Gallery: GlobalConfig = {
  slug: 'gallery',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Título opcional de la sección galería',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Imagen de la galería',
          },
        },
      ],
      admin: {
        description: 'Imágenes de la galería (máximo 4)',
      },
    },
  ],
}
