import { Resend } from 'resend'

interface ContactFormData {
  nombre: string
  apellidos: string
  email: string
  objetivos: string
  servicio: string
  dni?: string
  direccion?: string
}

interface SendEmailResponse {
  success: boolean
  error?: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Envía dos emails automáticos cuando se recibe un contacto:
 * 1. Email a info@rdtraining.es con los datos del formulario
 * 2. Email de confirmación al solicitante
 */
export async function sendContactEmails(
  data: ContactFormData
): Promise<SendEmailResponse> {
  try {
    // Validación básica
    if (!data.nombre || !data.email || !data.objetivos) {
      return {
        success: false,
        error: 'Faltan campos requeridos: nombre, email, objetivos',
      }
    }

    const emailFrom = process.env.CONTACT_EMAIL_FROM || 'noreply@rdtraining.es'
    const emailTo = process.env.CONTACT_EMAIL_TO || 'info@rdtraining.es'

    // Email 1: Enviar datos a info@rdtraining.es
    const adminEmailPromise = resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: `Nuevo contacto: ${data.nombre} ${data.apellidos}`,
      html: `
        <h2>Nuevo contacto recibido</h2>
        <p><strong>Nombre:</strong> ${data.nombre} ${data.apellidos}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Servicio:</strong> ${data.servicio}</p>${data.dni ? `
        <p><strong>DNI / NIF:</strong> ${data.dni}</p>` : ''}${data.direccion ? `
        <p><strong>Dirección:</strong> ${data.direccion}</p>` : ''}
        <p><strong>Objetivos:</strong></p>
        <p>${data.objetivos.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          Enviado desde: ${new Date().toLocaleString('es-ES')}
        </p>
      `,
    })

    // Email 2: Enviar confirmación al usuario
    const userEmailPromise = resend.emails.send({
      from: emailFrom,
      to: data.email,
      subject: 'Hemos recibido tu contacto - RD Training',
      html: `
        <h2>¡Gracias por contactar!</h2>
        <p>Hola ${data.nombre},</p>
        <p>Hemos recibido tu solicitud correctamente. Nos pondremos en contacto contigo lo antes posible.</p>
        <p><strong>Datos que hemos recibido:</strong></p>
        <ul>
          <li><strong>Nombre:</strong> ${data.nombre} ${data.apellidos}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Servicio:</strong> ${data.servicio}</li>${data.dni ? `
          <li><strong>DNI / NIF:</strong> ${data.dni}</li>` : ''}${data.direccion ? `
          <li><strong>Dirección:</strong> ${data.direccion}</li>` : ''}
          <li><strong>Objetivos:</strong> ${data.objetivos.substring(0, 100)}...</li>
        </ul>
        <p>Si tienes más preguntas, no dudes en contactarnos.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          RD Training - Entrenamientos Personalizados
        </p>
      `,
    })

    // Esperar a que se envíen ambos emails en paralelo
    const [adminEmail, userEmail] = await Promise.all([
      adminEmailPromise,
      userEmailPromise,
    ])

    // Verificar que ambos se enviaron correctamente
    if (adminEmail.error || userEmail.error) {
      const errorMsg = adminEmail.error?.message || userEmail.error?.message
      console.error('Error enviando emails:', errorMsg)
      return {
        success: false,
        error: `Error al enviar emails: ${errorMsg}`,
      }
    }

    console.log('Emails enviados exitosamente:', {
      adminEmailId: adminEmail.data?.id,
      userEmailId: userEmail.data?.id,
    })

    return { success: true }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido'
    console.error('Error en sendContactEmails:', errorMessage)
    return {
      success: false,
      error: errorMessage,
    }
  }
}
