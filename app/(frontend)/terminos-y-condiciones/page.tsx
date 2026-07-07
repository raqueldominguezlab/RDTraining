import { Metadata } from 'next'
import { Suspense } from 'react'
import TerminosBackButton from '@/app/(frontend)/_components/TerminosBackButton'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones de uso, política de privacidad, política de cookies y disclaimer médico de RDTRAINING',
}

function BackButtonLoading() {
  return (
    <div className="inline-flex items-center text-gray-400 mb-8">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Cargando...
    </div>
  )
}

export default function TerminosPage() {
  const termsPdfPath = '/T%C3%A9rminos%20y%20Condiciones%20RDTraining.pdf'

  return (
    <main className="w-full py-16 md:py-24 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<BackButtonLoading />}>
          <TerminosBackButton />
        </Suspense>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
          Términos y Condiciones
        </h1>

        <a
          href={termsPdfPath}
          download
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 mb-8 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Descargar términos y condiciones en PDF"
        >
          Descargar PDF
        </a>

        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">RDTRAINING</h2>
            <p>
              El presente documento integra los Términos y Condiciones de Uso, la Política de Privacidad,
              la Política de Cookies y el Disclaimer Médico y de Actividad Física aplicables a la plataforma
              RDTRAINING.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Términos y Condiciones de Uso
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.1 Información general</h3>
            <p>
              En cumplimiento con la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio
              Electrónico (LSSI-CE), se informa que la plataforma RDTRAINING (en adelante, la Plataforma)
              es titularidad de Jorge González con NIF 51190076B y domicilio social en la Avenida de los Andres 22, Portal A 5A, Madrid, España.
            </p>
            <p>
              RDTRAINING pone a disposición de los usuarios una plataforma digital destinada a facilitar la
              conexión entre profesionales del entrenamiento, asesoramiento deportivo o nutricional
              (Usuarios Entrenadores/Asesores) y personas interesadas en contratar dichos servicios
              (Usuarios Clientes).
            </p>
            <p>
              El acceso, navegación y uso de la Plataforma implica la aceptación plena de los presentes
              Términos y Condiciones.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.2 Objeto de la plataforma</h3>
            <p>RDTRAINING proporciona una plataforma tecnológica que permite a los usuarios:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Conectar con profesionales del entrenamiento o asesoramiento fitness.</li>
              <li>Contratar servicios de entrenamiento o asesoramiento.</li>
              <li>Compartir información relacionada con la actividad deportiva.</li>
            </ul>
            <p>
              RDTRAINING no presta directamente servicios de entrenamiento personal, asesoramiento
              nutricional ni servicios sanitarios, limitándose a facilitar el entorno tecnológico para la
              interacción entre usuarios.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.3 Usuarios de la plataforma</h3>
            <p>La plataforma distingue dos tipos de usuarios:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Usuario Cliente: persona física que utiliza la plataforma para contratar servicios de
                entrenamiento o asesoramiento deportivo.
              </li>
              <li>
                Usuario Entrenador/Asesor: profesional que ofrece sus servicios de entrenamiento o
                asesoramiento a través de la plataforma.
              </li>
            </ul>
            <p>
              Los Usuarios Entrenadores/Asesores actúan en todo momento como profesionales
              independientes, no existiendo relación laboral, societaria o de representación con
              RDTRAINING.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.4 Registro de usuarios</h3>
            <p>
              Para acceder a determinadas funcionalidades de la Plataforma será necesario registrarse
              mediante la creación de una cuenta de usuario.
            </p>
            <p>El usuario se compromete a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar información veraz y actualizada.</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>No permitir el uso de su cuenta por terceros.</li>
            </ul>
            <p>
              RDTRAINING se reserva el derecho de suspender o cancelar cuentas en caso de uso indebido
              o incumplimiento de los presentes términos.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.5 Servicios ofrecidos</h3>
            <p>A través de la Plataforma, los Usuarios Entrenadores/Asesores podrán ofrecer servicios como:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Programas de entrenamiento.</li>
              <li>Asesoramiento fitness.</li>
              <li>Seguimiento deportivo.</li>
              <li>Planificación de rutinas.</li>
            </ul>
            <p>
              Los Usuarios Clientes podrán contratar dichos servicios conforme a las condiciones
              establecidas por cada profesional.
            </p>
            <p>
              RDTRAINING no garantiza resultados deportivos específicos, ya que estos dependen de
              múltiples factores personales.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.6 Pagos y transacciones</h3>
            <p>
              Los pagos realizados a través de la Plataforma podrán gestionarse mediante pasarelas de
              pago externas.
            </p>
            <p>
              RDTRAINING no almacena información financiera de los usuarios y no se responsabiliza del
              funcionamiento de dichas plataformas de pago.
            </p>
            <p>
              Las condiciones económicas de los servicios ofrecidos serán determinadas por cada Usuario
              Entrenador/Asesor.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1.7 Política de cancelación y reembolsos
            </h3>
            <p>
              Las condiciones de cancelación, modificación o reembolso de los servicios contratados serán
              establecidas por cada Usuario Entrenador/Asesor.
            </p>
            <p>
              RDTRAINING actúa únicamente como intermediario tecnológico y no interviene en los acuerdos
              económicos entre usuarios, salvo en lo relativo a la operativa técnica de la plataforma.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1.8 Responsabilidad sobre la actividad física
            </h3>
            <p>
              El Usuario Cliente reconoce que la práctica de actividad física implica riesgos inherentes.
              Antes de iniciar cualquier programa de entrenamiento o actividad deportiva, el usuario deberá
              asegurarse de que su estado de salud es adecuado para la práctica deportiva, pudiendo
              consultar con un profesional sanitario si fuese necesario.
            </p>
            <p>
              RDTRAINING no será responsable de lesiones, daños o perjuicios derivados de la práctica de
              actividades físicas realizadas siguiendo recomendaciones obtenidas a través de la Plataforma.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.9 Contenidos de los usuarios</h3>
            <p>Los usuarios podrán publicar contenido en la Plataforma, incluyendo:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Información personal o profesional.</li>
              <li>Programas de entrenamiento.</li>
              <li>Comentarios o mensajes.</li>
            </ul>
            <p>
              El usuario garantiza que dispone de los derechos necesarios sobre los contenidos que publica
              y que dichos contenidos no infringen derechos de terceros.
            </p>
            <p>RDTRAINING se reserva el derecho de eliminar contenidos que:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sean ilegales.</li>
              <li>Resulten ofensivos.</li>
              <li>Infrinjan derechos de terceros.</li>
              <li>Vulneren los presentes términos.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.10 Propiedad intelectual</h3>
            <p>Todos los contenidos de la Plataforma, incluyendo:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Diseño.</li>
              <li>Estructura.</li>
              <li>Software.</li>
              <li>Base de datos.</li>
              <li>Biblioteca de ejercicios.</li>
              <li>Imágenes.</li>
              <li>Textos.</li>
            </ul>
            <p>
              Son propiedad de RDTRAINING o de terceros autorizados y están protegidos por la normativa
              de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o
              explotación sin autorización expresa.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.11 Uso correcto de la plataforma</h3>
            <p>Los usuarios se comprometen a utilizar la Plataforma de manera adecuada y a no:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizarla con fines ilícitos.</li>
              <li>Suplantar la identidad de otros usuarios.</li>
              <li>Introducir virus o software malicioso.</li>
              <li>Intentar acceder a áreas restringidas del sistema.</li>
            </ul>
            <p>El incumplimiento podrá implicar la suspensión o cancelación de la cuenta.</p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.12 Limitación de responsabilidad</h3>
            <p>RDTRAINING no será responsable de:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>La calidad de los servicios ofrecidos por los Usuarios Entrenadores/Asesores.</li>
              <li>Los resultados obtenidos por los Usuarios Clientes.</li>
              <li>Los acuerdos alcanzados entre usuarios.</li>
              <li>Interrupciones del servicio por causas técnicas o de fuerza mayor.</li>
            </ul>
            <p>
              La responsabilidad de los servicios prestados recae exclusivamente en el profesional que los
              ofrece.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1.13 Suspensión o cancelación del servicio
            </h3>
            <p>RDTRAINING podrá suspender temporal o permanentemente el acceso a la Plataforma en caso de:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Incumplimiento de los presentes términos.</li>
              <li>Actividades fraudulentas.</li>
              <li>Uso indebido de la plataforma.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.14 Enlaces a terceros</h3>
            <p>
              La Plataforma puede contener enlaces a páginas web o servicios de terceros. RDTRAINING no se
              responsabiliza del contenido, funcionamiento o políticas de privacidad de dichos sitios.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.15 Protección de datos personales</h3>
            <p>
              El tratamiento de los datos personales de los usuarios se realizará conforme al Reglamento
              (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía
              de los Derechos Digitales (LOPDGDD).
            </p>
            <p>Para más información, los usuarios pueden consultar la Política de Privacidad de la Plataforma.</p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1.16 Modificación de los términos</h3>
            <p>
              RDTRAINING se reserva el derecho de modificar los presentes Términos y Condiciones en
              cualquier momento. Las modificaciones serán publicadas en la Plataforma y entrarán en vigor
              desde su publicación.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              1.17 Legislación aplicable y jurisdicción
            </h3>
            <p>
              Los presentes Términos y Condiciones se regirán por la legislación española. Para la
              resolución de cualquier controversia que pudiera derivarse del uso de la Plataforma, las
              partes se someten a los Juzgados y Tribunales de España, salvo que la normativa de
              consumidores establezca otra jurisdicción.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Política de Privacidad</h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Responsable del tratamiento</h3>
            <p>
              En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD),
              se informa que los datos personales recogidos a través de la plataforma RDTRAINING serán
              tratados por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Responsable: Jorge González Álvarez.</li>
              <li>Email de contacto: info@rdtraining.es.</li>
              <li>Actividad: Plataforma digital de entrenamiento y asesoramiento fitness.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2.2 Datos personales que recopilamos
            </h3>
            <p>Podremos recopilar las siguientes categorías de datos:</p>
            <p><strong>Datos identificativos</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nombre.</li>
              <li>Apellidos.</li>
              <li>Dirección de correo electrónico.</li>
            </ul>
            <p><strong>Datos de perfil</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Información profesional (para entrenadores).</li>
              <li>Experiencia deportiva.</li>
              <li>Fotografía de perfil.</li>
            </ul>
            <p><strong>Datos relacionados con el entrenamiento</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Progreso deportivo.</li>
              <li>Rutinas de entrenamiento.</li>
              <li>Objetivos fitness.</li>
              <li>Información física proporcionada voluntariamente.</li>
            </ul>
            <p><strong>Datos técnicos</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dirección IP.</li>
              <li>Tipo de dispositivo.</li>
              <li>Navegador.</li>
              <li>Sistema operativo.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.3 Finalidad del tratamiento</h3>
            <p>Los datos personales serán utilizados para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestionar el registro y acceso a la plataforma.</li>
              <li>Facilitar la conexión entre entrenadores y clientes.</li>
              <li>Gestionar los servicios contratados.</li>
              <li>Mejorar la experiencia de usuario.</li>
              <li>Prevenir fraudes o usos indebidos.</li>
              <li>Cumplir obligaciones legales.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.4 Base legal del tratamiento</h3>
            <p>El tratamiento de los datos se basa en:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ejecución de un contrato (uso de la plataforma).</li>
              <li>Consentimiento del usuario.</li>
              <li>Cumplimiento de obligaciones legales.</li>
              <li>Interés legítimo de RDTRAINING para mejorar el servicio y garantizar la seguridad.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.5 Comunicación de datos a terceros</h3>
            <p>Los datos podrán ser comunicados a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proveedores tecnológicos necesarios para el funcionamiento de la plataforma.</li>
              <li>Pasarelas de pago.</li>
              <li>Autoridades públicas cuando exista obligación legal.</li>
            </ul>
            <p>RDTRAINING no vende ni comercializa datos personales.</p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.6 Interacción entre usuarios</h3>
            <p>
              Los Usuarios Clientes podrán compartir información con los Usuarios Entrenadores/Asesores a
              través de la plataforma. Cada Usuario Entrenador será responsable del tratamiento de los datos
              que reciba en el contexto de su relación profesional con el cliente.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.7 Conservación de los datos</h3>
            <p>Los datos personales se conservarán mientras:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Exista una cuenta activa en la plataforma.</li>
              <li>Sea necesario para la prestación del servicio.</li>
              <li>Exista una obligación legal de conservación.</li>
            </ul>
            <p>
              Una vez finalizada la relación, los datos podrán mantenerse bloqueados durante los plazos
              legalmente establecidos.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.8 Derechos de los usuarios</h3>
            <p>Los usuarios pueden ejercer los siguientes derechos:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceso.</li>
              <li>Rectificación.</li>
              <li>Supresión.</li>
              <li>Limitación del tratamiento.</li>
              <li>Portabilidad de datos.</li>
              <li>Oposición.</li>
            </ul>
            <p>
              Para ejercerlos pueden contactar en info@rdtraining.es. También tienen derecho a presentar
              reclamación ante la Agencia Española de Protección de Datos.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.9 Seguridad de los datos</h3>
            <p>
              RDTRAINING adopta medidas técnicas y organizativas adecuadas para garantizar la seguridad
              de los datos personales y evitar su pérdida, alteración o acceso no autorizado.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              2.10 Cambios en la política de privacidad
            </h3>
            <p>
              RDTRAINING podrá modificar la presente política para adaptarla a cambios normativos o
              mejoras en el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Política de Cookies</h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 ¿Qué son las cookies?</h3>
            <p>
              Las cookies son pequeños archivos que se almacenan en el dispositivo del usuario cuando
              visita una página web o utiliza una aplicación. Permiten recordar información sobre la
              navegación para mejorar la experiencia de usuario.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Tipos de cookies utilizadas</h3>
            <p><strong>Cookies técnicas</strong></p>
            <p>Necesarias para el funcionamiento básico de la plataforma.</p>
            <p><strong>Cookies de análisis</strong></p>
            <p>Permiten analizar el uso de la plataforma para mejorar el servicio.</p>
            <p><strong>Cookies de personalización</strong></p>
            <p>Permiten recordar preferencias del usuario.</p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.3 Gestión de cookies</h3>
            <p>
              El usuario puede aceptar, rechazar o configurar el uso de cookies a través del banner de
              configuración que aparece al acceder a la plataforma.
            </p>
            <p>También puede eliminar cookies desde la configuración de su navegador.</p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.4 Cookies de terceros</h3>
            <p>
              La plataforma puede utilizar cookies de servicios externos como herramientas de análisis o
              plataformas de pago.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              3.5 Cambios en la política de cookies
            </h3>
            <p>
              RDTRAINING podrá actualizar esta política para adaptarla a cambios legales o técnicos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Disclaimer Médico y de Actividad Física
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 Naturaleza de la información</h3>
            <p>
              La información, programas de entrenamiento y recomendaciones disponibles en la plataforma
              RDTRAINING tienen fines informativos y educativos relacionados con la actividad física y el
              bienestar.
            </p>
            <p>
              No constituyen asesoramiento médico ni sustituyen la consulta con profesionales sanitarios.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 Consulta médica previa</h3>
            <p>
              Antes de iniciar cualquier programa de entrenamiento o actividad física, se recomienda que el
              usuario consulte con un profesional médico cualificado, especialmente en caso de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enfermedades previas.</li>
              <li>Lesiones.</li>
              <li>Problemas cardiovasculares.</li>
              <li>Embarazo.</li>
              <li>Condiciones médicas especiales.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.3 Riesgos de la actividad física</h3>
            <p>
              El usuario reconoce que la práctica deportiva implica riesgos inherentes que pueden incluir:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lesiones musculares.</li>
              <li>Lesiones articulares.</li>
              <li>Fatiga física.</li>
              <li>Otros riesgos asociados al ejercicio.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.4 Responsabilidad del usuario</h3>
            <p>
              Cada usuario es responsable de evaluar su condición física y adaptar la intensidad del
              ejercicio a sus capacidades.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.5 Limitación de responsabilidad</h3>
            <p>RDTRAINING no será responsable de:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lesiones derivadas de la práctica deportiva.</li>
              <li>Uso incorrecto de programas de entrenamiento.</li>
              <li>Recomendaciones proporcionadas por terceros dentro de la plataforma.</li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Última actualización:</strong> 6 de marzo de 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
