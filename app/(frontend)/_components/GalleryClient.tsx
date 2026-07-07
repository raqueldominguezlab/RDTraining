'use client'

type GalleryImage = {
  url: string
  alt?: string
}

type GalleryData = {
  sectionTitle?: string
  images: GalleryImage[]
}

export default function GalleryClient({ data }: { data: GalleryData }) {
  if (!data.images || data.images.length === 0) return null

  return (
    <section className="w-full py-16 md:py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {data.sectionTitle && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {data.sectionTitle}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.images.map((img, i) => (
            <div
              key={i}
              className="aspect-[3/5] rounded-2xl overflow-hidden shadow-lg group"
            >
              <img
                src={img.url}
                alt={img.alt || ''}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
