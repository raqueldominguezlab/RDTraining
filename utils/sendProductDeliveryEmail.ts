import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendDeliveryEmailParams {
  to: string
  productTitle: string
  subject?: string | null
  introText?: string | null
  downloadUrl: string
  orderId: string
}

/**
 * Envía el email de entrega del PDF tras confirmar el pago. Mismo proveedor
 * (Resend) y patrón que utils/sendContactEmails.ts.
 */
export async function sendProductDeliveryEmail({
  to,
  productTitle,
  subject,
  introText,
  downloadUrl,
  orderId,
}: SendDeliveryEmailParams): Promise<{ success: boolean; error?: string }> {
  const emailFrom = process.env.PRODUCT_EMAIL_FROM || process.env.CONTACT_EMAIL_FROM || 'noreply@rdtraining.es'

  try {
    const { error } = await resend.emails.send({
      from: emailFrom,
      to,
      subject: subject || `Tu descarga: ${productTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
          <h2>¡Pago confirmado!</h2>
          <p>${introText || `Gracias por tu compra de "${productTitle}".`}</p>
          <p style="margin:28px 0">
            <a href="${downloadUrl}"
               style="background:#111;color:#fff;padding:14px 24px;
                      text-decoration:none;border-radius:6px;display:inline-block">
              Descargar (PDF)
            </a>
          </p>
          <p style="color:#666;font-size:13px">El enlace es personal, caduca en 72 horas
          y solo se puede usar unas pocas veces. Referencia del pedido: ${orderId}.</p>
          <p style="color:#666;font-size:13px">Si tienes cualquier problema, responde a este email.</p>
        </div>
      `,
    })

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, error: message }
  }
}
