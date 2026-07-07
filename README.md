# rdominguezg — Web de Entrenamiento Personal

Sitio web de Rocío Domínguez, entrenadora personal especializada en Hyrox. Construido con **Next.js 15**, **Payload CMS 3** y desplegado en **Vercel** con almacenamiento de media en **Cloudflare R2**.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind CSS |
| CMS | Payload CMS 3 |
| Base de datos | PostgreSQL (Neon) |
| Media | Cloudflare R2 (S3-compatible) |
| Deploy | Vercel |
| Idiomas | Español / Inglés (i18n con Payload) |

---

## Desarrollo local

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env.local

# Levantar base de datos local (Docker)
docker compose up -d

# Iniciar servidor de desarrollo
pnpm dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Admin CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Estructura del proyecto

```
app/
├── (frontend)/          # Rutas públicas del sitio
│   ├── page.tsx         # Página principal (Hero + About + Servicios)
│   ├── contacto/        # Formulario de contacto
│   └── _components/     # Componentes React
├── (payload)/           # Panel de administración Payload
collections/
├── Media.ts             # Gestión de archivos (imágenes/vídeos)
├── Services.ts          # Servicios de entrenamiento
└── Users.ts             # Usuarios del CMS
globals/
├── HomeHero.ts          # Sección Hero de portada
└── AboutSection.ts      # Sección "Mi Historia"
```

---

## Guía de imágenes para el CMS

### 1. Hero — Imagen / Vídeo de fondo

> **Dónde:** Admin → Globals → Home Hero → `heroImage`

La imagen ocupa el 100% del viewport (pantalla completa) con `object-cover`. Es la imagen más importante del sitio y también se usa como imagen Open Graph en redes sociales.

| Parámetro | Valor recomendado |
|---|---|
| **Tamaño** | 1920 × 1080 px (mínimo) |
| **Proporción** | 16:9 |
| **Peso máximo** | 800 KB (JPG/WebP) |
| **Resolución alta** | 2560 × 1440 px |
| **Vídeo** | MP4/WebM, máx. 10 MB, sin audio |
| **Foco visual** | Centrado — el sujeto debe estar centrado |

> 💡 El hero tiene un overlay oscuro encima; imágenes con buen contraste y sujeto centrado funcionan mejor. Evitar texto incrustado en la imagen.

---

### 2. Foto personal — Sección "Mi Historia"

> **Dónde:** Admin → Globals → About Section → `photo`

Se muestra en cuadrado perfecto (`aspect-square`) dentro de una columna de ~450 px de ancho máximo. En móvil ocupa el ancho completo.

| Parámetro | Valor recomendado |
|---|---|
| **Tamaño** | 800 × 800 px (mínimo) |
| **Proporción** | **1:1 (cuadrada)** |
| **Peso máximo** | 300 KB (JPG/WebP) |
| **Enfoque** | Retrato profesional, cuerpo entero o medio cuerpo |

> 💡 Si la foto original es rectangular, recortarla a cuadrado antes de subir para evitar recortes inesperados en diferentes pantallas.

---

### 3. Imagen de servicio — Tarjetas de servicios

> **Dónde:** Admin → Collections → Services → `image`

Se muestra como cabecera de la tarjeta de servicio con altura fija de **192 px** (`h-48`) y ancho variable. En escritorio las tarjetas ocupan ~1/3 del contenedor (≈400 px). El comportamiento es `object-cover` con efecto zoom al hover.

| Parámetro | Valor recomendado |
|---|---|
| **Tamaño** | 800 × 400 px |
| **Proporción** | **2:1 (landscape)** |
| **Peso máximo** | 200 KB (JPG/WebP) |
| **Alternativa** | Si no se sube imagen, se muestra un icono emoji |

> 💡 Si no se especifica imagen, la tarjeta muestra el icono configurado en el campo `icon`. Las imágenes deben tener buen contraste para que el badge "Destacado" sea legible.

---

### 4. Open Graph / Redes sociales

La imagen de Open Graph se genera automáticamente a partir de la **imagen del Hero**. No requiere subir una imagen separada.

| Parámetro | Valor |
|---|---|
| **Tamaño ideal** | 1200 × 630 px |
| **Proporción** | ~1.91:1 |
| **Nota** | Si el hero tiene estas dimensiones, el preview en redes será perfecto |

---

### Resumen rápido

| Imagen | Proporción | Tamaño mínimo | Peso máx |
|---|---|---|---|
| Hero (fondo) | 16:9 | 1920 × 1080 px | 800 KB |
| Foto personal (About) | 1:1 | 800 × 800 px | 300 KB |
| Imagen de servicio | 2:1 | 800 × 400 px | 200 KB |
| Open Graph (auto) | ~1.91:1 | —usa el hero— | — |

---

## Variables de entorno

```env
DATABASE_URL=           # PostgreSQL (Neon)
PAYLOAD_SECRET=         # Clave secreta Payload (mín. 32 chars)
S3_BUCKET=              # Nombre del bucket R2 (público, para media)
S3_ACCESS_KEY_ID=       # Credencial R2
S3_SECRET_ACCESS_KEY=   # Credencial R2
S3_REGION=auto          # Región R2
S3_ENDPOINT=            # Endpoint R2 (https://<id>.r2.cloudflarestorage.com)
R2_PUBLIC_URL=          # URL pública del bucket R2

# Pasarela de pago (suscripciones, /pago)
REDSYS_SECRET_KEY=      # Clave secreta SHA-256 del TPV (Base64)
REDSYS_FUC=             # Código de comercio
REDSYS_TERMINAL=        # Terminal (normalmente "1")
REDSYS_ENVIRONMENT=     # "test" | "production"
NEXT_PUBLIC_SITE_URL=   # URL raíz del sitio

# Email de contacto
RESEND_API_KEY=
CONTACT_EMAIL_FROM=
CONTACT_EMAIL_TO=

# Productos de pago único (PDF) — bucket R2 PRIVADO, sin dominio público
R2_PRIVATE_BUCKET=
R2_PRIVATE_ACCESS_KEY_ID=
R2_PRIVATE_SECRET_ACCESS_KEY=
R2_PRIVATE_ENDPOINT=
PRODUCT_EMAIL_FROM=     # Remitente del email de entrega del PDF
```

---

## Scripts

```bash
pnpm dev              # Servidor de desarrollo
pnpm build            # Build de producción
pnpm start            # Servidor de producción
pnpm generate:types   # Regenerar tipos TypeScript desde el esquema Payload
```

---

## Deploy

El proyecto se despliega automáticamente en **Vercel** al hacer push a `main`.

```bash
git push origin main
```
