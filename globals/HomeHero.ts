import type { GlobalConfig } from 'payload'

export const HomeHero: GlobalConfig = {
  slug: 'home-hero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Imagen de fondo del Hero (atleta en acción, competición Hyrox, etc.)',
      },
    },
    {
      name: 'statements',
      type: 'array',
      required: true,
      localized: true,
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Afirmaciones empoderadoras que se muestran en el Hero',
      },
      fields: [
        {
          name: 'statement',
          type: 'richText',
          required: true,
          admin: {
            description: 'Afirmación con opción de negrita. Máximo 220 caracteres (ej: "Tu cuerpo **SÍ puede** conquistar los 8km")',
          },
          // validate: (value) => {
          //   if (!value) return true
          //   // Extrae el texto sin formato
          //   const plainText = JSON.stringify(value).replace(/<[^>]*>/g, '')
          //   console.log('plainText:', plainText)
          //   if (plainText.length > 220) {
          //     return 'La afirmación no puede exceder 220 caracteres'
          //   }
          //   return true
          // },
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Entrena conmigo GRATIS',
      admin: {
        description: 'Texto del botón principal (ej: "Entrena conmigo GRATIS")',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      required: false,
      defaultValue: '#contacto',
      admin: {
        description: 'Enlace del botón CTA',
      },
    },
    {
      name: 'badgeText',
      type: 'text',
      required: false,
      localized: true,
      admin: {
        description: 'Texto del badge superior (ej: "Especialista Hyrox")',
      },
    },
    {
      name: 'scrollText',
      type: 'text',
      required: false,
      localized: true,
      defaultValue: 'Descubre más',
      admin: {
        description: 'Texto del indicador de scroll',
      },
    },
  ],
}
