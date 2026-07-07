import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cliente S3 aparte para el bucket privado de PDFs (no confundir con el
// bucket público de `media`, configurado en payload.config.ts vía el plugin
// s3Storage). Se usa únicamente para generar enlaces de descarga temporales.
function privateS3Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_PRIVATE_ENDPOINT || '',
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_PRIVATE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_PRIVATE_SECRET_ACCESS_KEY || '',
    },
  })
}

/**
 * Genera una URL firmada de corta duración (por defecto 60s) para descargar
 * un objeto del bucket privado. `key` es la ruta dentro del bucket, ej.
 * "product-files/<filename>" (prefix configurado en payload.config.ts).
 */
export async function createPrivateDownloadUrl(
  key: string,
  downloadFilename: string,
  expiresInSeconds = 60
): Promise<string> {
  const client = privateS3Client()
  const command = new GetObjectCommand({
    Bucket: process.env.R2_PRIVATE_BUCKET || '',
    Key: key,
    ResponseContentDisposition: `attachment; filename="${downloadFilename}"`,
    ResponseContentType: 'application/pdf',
  })
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}
