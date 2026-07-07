'use client'

import { useState } from 'react'
import Link from 'next/link'

const t = {
  es: {
    title: 'Ya casi estás, deja aquí tus datos',
    backLink: 'Volver a servicios',
    serviceLabel: 'Servicio',
    nombreLabel: 'Nombre',
    apellidosLabel: 'Apellidos',
    emailLabel: 'Email',
    nombrePlaceholder: 'Tu nombre',
    apellidosPlaceholder: 'Tus apellidos',
    emailPlaceholder: 'tu@email.com',
    objetivosLabel: 'Cuéntame más sobre ti',
    objetivosPlaceholder: '¿Cuáles son tus objetivos, retos o qué te ha traído hasta aquí? Cuéntame lo que quieras...',
    dniLabel: 'DNI / NIF',
    dniPlaceholder: '12345678A',
    direccionLabel: 'Dirección',
    direccionPlaceholder: 'Calle, número, piso, código postal, ciudad',
    submitButton: 'Enviar y pagar',
    checkTerms: 'Acepto los términos y condiciones de uso y política de privacidad',
    checkHealth: 'Consiento expresamente el tratamiento de mis datos de salud para la prestación de los servicios a través de la app',
    redirecting: 'Redirigiendo a pasarela de pago...',
    backHome: 'Volver al inicio',
  },
  en: {
    title: "You're almost there, leave your details here",
    backLink: 'Back to services',
    serviceLabel: 'Service',
    nombreLabel: 'First name',
    apellidosLabel: 'Last name',
    emailLabel: 'Email',
    nombrePlaceholder: 'Your first name',
    apellidosPlaceholder: 'Your last name',
    emailPlaceholder: 'you@email.com',
    objetivosLabel: 'Tell me more about yourself',
    objetivosPlaceholder: 'What are your goals, challenges, or what brought you here? Share whatever you like...',
    dniLabel: 'ID Number',
    dniPlaceholder: '12345678A',
    direccionLabel: 'Address',
    direccionPlaceholder: 'Street, number, floor, postal code, city',
    submitButton: 'Send and pay',
    checkTerms: 'I accept the terms and conditions of use and privacy policy',
    checkHealth: 'I expressly consent to the processing of my health data for the provision of services through the app',
    redirecting: 'Redirecting to payment gateway...',
    backHome: 'Back to home',
  },
} as const

interface ContactFormProps {
  servicio: string
  amount?: string
  locale?: 'es' | 'en'
  paymentCompleted?: boolean
}

export default function ContactForm({ servicio, amount = '', locale = 'es', paymentCompleted = false }: ContactFormProps) {
  const tr = t[locale]
  const [formData, setFormData] = useState({
    servicio,
    nombre: '',
    apellidos: '',
    email: '',
    dni: '',
    direccion: '',
    objetivos: '',
  })
  const [checkTerms, setCheckTerms] = useState(false)
  const [checkHealth, setCheckHealth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Enviar formulario de contacto
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al enviar el formulario')
        setLoading(false)
        return
      }

      // Mostrar pantalla de agradecimiento
      setSubmitted(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Error: ${errorMessage}`)
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {locale === 'es' ? 'BIENVENIDO AL EQUIPO' : 'Welcome to the team'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {locale === 'es'
              ? 'Hemos recibido tus datos correctamente. En breve nos pondremos en contacto contigo.'
              : 'We have received your details. We will get in touch with you shortly.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            {locale === 'es' ? 'Volver al inicio' : 'Back to home'}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Back link */}
        <Link
          href="/#servicios"
          className="inline-flex items-center text-accent-500 hover:text-accent-600 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {tr.backLink}
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {tr.title}
          </h1>
          {/* <p className="text-gray-600 dark:text-gray-300 mb-8">
            Rellena el formulario y te contactaré lo antes posible.
          </p> */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Servicio */}
            <div>
              <label htmlFor="servicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {tr.serviceLabel}
              </label>
              <input
                type="text"
                id="servicio"
                name="servicio"
                value={formData.servicio}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              />
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {tr.nombreLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder={tr.nombrePlaceholder}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {tr.apellidosLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                placeholder={tr.apellidosPlaceholder}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {tr.emailLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={tr.emailPlaceholder}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* DNI - solo después del pago */}
            {paymentCompleted && (
              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {tr.dniLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  placeholder={tr.dniPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                />
              </div>
            )}

            {/* Dirección - solo después del pago */}
            {paymentCompleted && (
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {tr.direccionLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  placeholder={tr.direccionPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors"
                />
              </div>
            )}

            {/* Objetivos y retos */}
            <div>
              <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {tr.objetivosLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="objetivos"
                name="objetivos"
                value={formData.objetivos}
                onChange={handleChange}
                placeholder={tr.objetivosPlaceholder}
                rows={4}
                required
                minLength={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Checkboxes de consentimiento */}
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkTerms}
                  onChange={e => setCheckTerms(e.target.checked)}
                  required
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-accent-500 focus:ring-accent-500 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-snug group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                  Acepto los{' '}
                  <Link 
                    href={`/terminos-y-condiciones?servicio=${encodeURIComponent(formData.servicio)}`}
                    rel="noopener noreferrer"
                    className="text-accent-500 hover:text-accent-600 underline"
                  >
                    términos y condiciones de uso y política de privacidad
                  </Link>
                  {' '}<span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkHealth}
                  onChange={e => setCheckHealth(e.target.checked)}
                  required
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-accent-500 focus:ring-accent-500 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-snug group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                  {tr.checkHealth} <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!checkTerms || !checkHealth || loading}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                    <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10" opacity="0.75" />
                  </svg>
                  {paymentCompleted ? (locale === 'es' ? 'Enviando...' : 'Sending...') : tr.redirecting}
                </>
              ) : (
                paymentCompleted ? (locale === 'es' ? 'Enviar' : 'Send') : tr.submitButton
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
