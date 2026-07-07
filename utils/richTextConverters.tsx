'use client'

import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'

// Bitmask para formato de texto
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8

/**
 * Base converters con estilos para toda la aplicación
 * Incluye: listas, citas, y formato de texto estándar
 */
export const baseRichTextConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  
  // Listas ordenadas y desordenadas
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.listType === 'number' ? 'ol' : 'ul'
    const listClass = node.listType === 'number' 
      ? 'list-decimal list-inside space-y-2 my-4 pl-4'
      : 'list-disc list-inside space-y-2 my-4 pl-4'
    
    return <Tag className={listClass}>{children}</Tag>
  },
  
  // Items de lista
  listitem: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return <li className="text-gray-700 dark:text-gray-300">{children}</li>
  },
  
  // Citas / Blockquotes
  quote: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <blockquote className="border-l-4 border-accent-500 pl-4 my-6 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 py-3 rounded-r-lg">
        {children}
      </blockquote>
    )
  },
  
  // Texto con formato (negrita, itálica, etc)
  text: ({ node }) => {
    let text: React.ReactNode = node.text

    // Aplicar formatos en orden
    if (node.format & IS_BOLD) {
      text = <strong className="font-bold">{text}</strong>
    }
    if (node.format & IS_ITALIC) {
      text = <em className="italic">{text}</em>
    }
    if (node.format & IS_UNDERLINE) {
      text = <span className="underline">{text}</span>
    }
    if (node.format & IS_STRIKETHROUGH) {
      text = <span className="line-through">{text}</span>
    }

    return <>{text}</>
  },
})

/**
 * Converters específicos para el Hero
 * Negrita con estilo especial (blanco, uppercase, extra bold)
 */
export const heroRichTextConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  text: ({ node }) => {
    let text: React.ReactNode = node.text

    if (node.format & IS_BOLD) {
      text = (
        <strong
          style={{
            fontWeight: 900,
            color: 'white',
            textTransform: 'uppercase',
          }}
        >
          {text}
        </strong>
      )
    }

    return <>{text}</>
  },
})

/**
 * Converters combinados: base + hero (para usar en el Hero si necesita listas también)
 */
export const heroFullConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => {
  const base = baseRichTextConverters({ defaultConverters })
  const hero = heroRichTextConverters({ defaultConverters })
  
  return {
    ...base,
    text: hero.text, // Usar el estilo de texto del hero
  }
}
