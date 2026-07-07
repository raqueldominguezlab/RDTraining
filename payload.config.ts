import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { es } from "@payloadcms/translations/languages/es";
import { en } from "@payloadcms/translations/languages/en";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users.ts";
import { Media } from "./collections/Media.ts";
import { Services } from "./collections/Services.ts";
import { Products } from "./collections/Products.ts";
import { ProductFiles } from "./collections/ProductFiles.ts";
import { Orders } from "./collections/Orders.ts";
import { HomeHero } from "./globals/HomeHero.ts";
import { AboutSection } from "./globals/AboutSection.ts";
import { BestForYou } from "./globals/BestForYou.ts";
import { Gallery } from "./globals/Gallery.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  i18n: {
    supportedLanguages: { es, en },
    fallbackLanguage: "es",
  },
  localization: {
    locales: [
      {
        code: 'es',
        label: 'Español',
      },
      {
        code: 'en',
        label: 'English',
      },
    ],
    defaultLocale: 'es',
    fallback: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Services, Products, ProductFiles, Orders],
  globals: [HomeHero, AboutSection, BestForYou, Gallery],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
          generateFileURL: ({ prefix, filename }) => {
            return `${process.env.R2_PUBLIC_URL || ''}/${prefix ? prefix + '/' : ''}${filename}`
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.S3_ENDPOINT || '',
        region: process.env.S3_REGION || 'auto',
        forcePathStyle: true,
      },
    }),
    // Bucket privado independiente para los PDFs de pago único: sin dominio
    // público vinculado, así que no hay generateFileURL — la descarga real
    // pasa siempre por app/api/products/download con un enlace firmado.
    s3Storage({
      collections: {
        'product-files': {
          prefix: 'product-files',
        },
      },
      bucket: process.env.R2_PRIVATE_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_PRIVATE_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_PRIVATE_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.R2_PRIVATE_ENDPOINT || '',
        region: 'auto',
        forcePathStyle: true,
      },
    }),
  ],
});
