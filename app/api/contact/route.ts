import { sendContactEmails } from '@/utils/sendContactEmails'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Parsear el body
    const body = await request.json()
    const { nombre, apellidos, email, objetivos, servicio, dni, direccion } = body

    // Validación de campos requeridos
    if (!nombre || !apellidos || !email || !objetivos) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan campos requeridos: nombre, apellidos, email, objetivos',
        },
        { status: 400 }
      )
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validación de longitud de caracteres
    if (nombre.length > 100 || apellidos.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Nombre o apellidos muy largos' },
        { status: 400 }
      )
    }

    if (objetivos.length < 10 || objetivos.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Los objetivos deben tener entre 10 y 2000 caracteres',
        },
        { status: 400 }
      )
    }

    // Llamar a la función de envío de emails
    const result = await sendContactEmails({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.toLowerCase().trim(),
      objetivos: objetivos.trim(),
      servicio: servicio || 'No especificado',
      dni: dni?.trim() || '',
      direccion: direccion?.trim() || '',
    })

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Error desconocido al enviar emails',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Tu contacto ha sido enviado correctamente',
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido'

    console.error('Error en POST /api/contact:', errorMessage)

    return NextResponse.json(
      {
        success: false,
        error: 'Error procesando tu contacto. Por favor, intenta de nuevo.',
      },
      { status: 500 }
    )
  }
}

// Método para validar que el endpoint existe
export async function GET() {
  return NextResponse.json({ message: 'Contact endpoint disponible' })
}
