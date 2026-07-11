import type { GlobalConfig } from 'payload'

export const AboutSection: GlobalConfig = {
  slug: 'about-section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Título de la sección (opcional; si se deja vacío no se muestra)',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Foto profesional',
      },
    },
    {
      name: 'biography',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Biografía breve (150-200 palabras)',
      },
    }
  ],
}
