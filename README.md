# Agrimatco Web

A modern web application built with **Astro** and **Tailwind CSS**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── assets/              # Imágenes que Astro optimiza (AVIF/WebP + srcset)
│   ├── backgrounds/     # Fotos de fondo (hero, banner, mapa)
│   ├── products/        # PNG de la línea Cultivar
│   └── ui/
│       ├── brand/       # Logos
│       ├── markers/     # Pin del mapa (WebP optimizado)
│       └── socials/     # Íconos de redes sociales
├── components/
│   ├── layout/          # Header, Footer
│   ├── gallery/         # Gallery, Lightbox
│   ├── sections/        # Bloques de la landing
│   └── ui/              # Piezas reusables
├── data/                # Helpers para URLs de Cloudinary
├── layouts/             # Layouts reutilizables
├── pages/               # Rutas del sitio
└── styles/              # Tailwind + tokens de marca

public/                  # Solo lo que NO se procesa: favicon, fuentes, robots.txt
_archive/                # Material sin uso. Queda en git pero NO se despliega
```

> `_archive/` está fuera de `public/` a propósito: Astro copia `public/` a
> `dist/` en cada build **sin mirar `.gitignore`**. Lo que está en `_archive/`
> sigue en el repo pero no se sube.

### Dónde va cada tipo de archivo

| Tipo | Carpeta | ¿Se optimiza? |
|---|---|---|
| Fotos de contenido | `src/assets/` | ✅ AVIF/WebP + `srcset` |
| Fondos pesados | `src/assets/` + `<Image>` | ✅ |
| Fondo CSS (`::before`) | `src/assets/` + `getImage()` + variable CSS | ✅ (ver nota) |
| Favicon, fuentes, PDFs | `public/` | ❌ por URL |

> ⚠️ **Fondos CSS:** `<Image>` no funciona en `background-image`. Se optimizan
> con `getImage()` en el frontmatter y una variable CSS:
> `style="--bg: url(...)"` + `before:bg-[image:var(--bg)]`.
> **Tailwind v4 no compila `bg-[url(var(--x))]`** (paréntesis anidados): deja la
> clase en el HTML pero no genera el CSS, y el fondo no aparece sin avisar.
> Usar `bg-[image:var(--x)]` + `before:content-['']`.

## 🔤 Fuentes

Se sirven en **WOFF2** con el TTF de respaldo (`format('woff2')` primero):

| Fuente | WOFF2 (lo que descarga el visitante) | TTF (respaldo) |
|---|---|---|
| Rubik | 108 KB | 348 KB |
| Unbounded | 253 KB | 759 KB |

Tras cambiar una fuente, reconvertir:

```bash
node -e "const w=require('wawoff2'),f=require('fs');w.compress(f.readFileSync('public/fonts/Rubik-VariableFont_wght.ttf')).then(b=>f.writeFileSync('public/fonts/Rubik-VariableFont_wght.woff2',b))"
```

## 🖼️ Galería desde Cloudinary

La página `/gallery` obtiene imágenes de la carpeta `AGRIMATCO` de Cloudinary.
No es necesario copiar imágenes a `src/assets/gallery/` ni declararlas en un archivo.
Al subir imágenes a esa carpeta, aparecerán en la galería al volver a generar el sitio.
Para personalizar el texto accesible, añade el contexto `alt` en los metadatos de la imagen;
el contexto `caption` se usa como título visible y, si falta, se reutiliza el texto alternativo.

El loader necesita estas credenciales en un archivo `.env` en la raíz del proyecto:

```env
PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
PUBLIC_CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

No compartas ni publiques `CLOUDINARY_API_SECRET`. Configura las mismas variables en el
entorno de build de Netlify. La galería lista hasta 500 imágenes de esa carpeta.

## 📤 Portal de carga para el cliente

La página `/upload` usa el widget de carga de `astro-cloudinary` para seleccionar y cargar
imágenes directamente a Cloudinary. No aparece en la navegación del sitio. Añade a `.env`
la variable pública del preset sin firma:

```env
PUBLIC_CLOUDINARY_UPLOAD_PRESET=nombre_del_preset
```

En Cloudinary crea un upload preset **unsigned** dedicado para el cliente y configúralo para
guardar en `AGRIMATCO`. El widget permite imágenes JPG, PNG, WebP y AVIF, hasta 10 MB cada una
y 20 por selección. Configura también esos límites en el preset; las opciones del widget son
una ayuda de interfaz, no un control de seguridad. Para asignar un nombre distinto a cada
imagen, usa el campo **ID público** de **Opciones avanzadas** del widget.

`/upload` no tiene login: `noindex` y no incluir el enlace en el menú no restringen el acceso.
Cualquier persona que consiga el enlace puede cargar archivos usando el preset público.
Para proteger el acceso se necesita añadir autenticación. Los archivos aparecen en la galería
después de una nueva publicación del sitio, porque la galería se genera durante el build.

### Deploy por lotes

Cada push a `main` dispara un deploy y consume créditos de Netlify. Para agrupar:

```bash
git commit -m "trabajo en curso [skip netlify]"   # no despliega
git commit -m "galería: 12 fotos nuevas"          # este sí despliega
```

Los Deploy Previews son ilimitados y gratis: itera en ramas de PR sin costo.

## 🛠️ Available Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run astro ...` | Run Astro CLI commands |

## 🎨 Styling

This project uses **Tailwind CSS** v4 for styling. All CSS configurations are handled through Tailwind's utility classes.

### Importing Styles
Global styles are imported in the main layout. Individual components can use scoped styles with the `<style>` tag.

## 📦 Technologies

- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📝 License

MIT
# Agrimatco
# Agrimatco
