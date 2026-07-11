'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { baseRichTextConverters } from '@/utils/richTextConverters'

type AboutData = {
  title: string
  subtitle: string
  photo?: { url: string; alt: string }
  biography: SerializedEditorState
  philosophyPillars: Array<{ icon: string; title: string; description: string }>
  certifications: Array<{ name: string; year?: number }>
}

const iconMap: Record<string, string> = {
  muscle: '💪',
  running: '🏃',
  group: '👥',
  target: '🎯',
  energy: '⚡',
  trophy: '🏆',
  heart: '❤️',
  fire: '🔥',
}

export default function AboutClient({ aboutData }: { aboutData: AboutData }) {
  return (
    <section className="w-full py-16 md:py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Intro */}
        {aboutData.title && (
          <div className="-mb-4 md:-mb-0">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight text-center">
                {aboutData.title}
              </h3>
            </div>
          </div>
        )}

        {/* Photo + Biography - Alternating Layout */}
        <div className="mb-20 md:mb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Photo */}
            {aboutData.photo?.url && (
              <div className="flex items-center justify-center order-2 md:order-1">
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={aboutData.photo.url}
                    alt={aboutData.photo.alt}
                    className="w-full h-auto max-h-[550px] object-cover"
                  />
                </div>
              </div>
            )}

            {/* Biography */}
            <div className="flex flex-col justify-center order-1 md:order-2">
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 text-lg">
                  {aboutData.biography && (
                    <RichText 
                      data={aboutData.biography} 
                      converters={baseRichTextConverters}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
