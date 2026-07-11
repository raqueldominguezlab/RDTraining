import { redirect } from 'next/navigation'

// Alias sin '#' para enlaces en redes sociales (Instagram codifica '#" como
// %23 y rompe los anclajes). /servicios redirige a la sección de la home.
export default function ServiciosRedirect() {
  redirect('/#servicios')
}
