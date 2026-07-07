import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { lookup } from 'mime-types'
import 'dotenv/config'

const s3 = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

const BUCKET = process.env.S3_BUCKET!
const MEDIA_DIR = join(process.cwd(), 'media')
const PREFIX = 'media'

async function main() {
  const files = readdirSync(MEDIA_DIR)
  console.log(`Found ${files.length} files to upload to R2...`)

  for (const file of files) {
    const filePath = join(MEDIA_DIR, file)
    const body = readFileSync(filePath)
    const contentType = lookup(file) || 'application/octet-stream'
    const key = `${PREFIX}/${file}`

    console.log(`Uploading ${key} (${contentType}, ${body.length} bytes)...`)

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    )

    console.log(`  ✓ ${key}`)
  }

  console.log(`\nDone! ${files.length} files uploaded to s3://${BUCKET}/${PREFIX}/`)
}

main().catch(console.error)
