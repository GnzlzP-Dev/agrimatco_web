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

La página `/gallery` obtiene las imágenes de la carpeta `AGRIMATCO/images` de Cloudinary.
No es necesario copiar imágenes a `src/assets/gallery/` ni declararlas en un archivo.
La galería organiza las fotos por categorías en una lista lateral. Cada grupo tiene su propio
título, descripción y mosaico de imágenes; al final se puede avanzar al grupo anterior o al
siguiente. En móvil, la lista se presenta en un menú compacto. Los metadatos se consultan en
páginas de ocho resultados y se agregan progresivamente con esqueletos de carga, mientras el
navegador carga las imágenes de forma diferida (`loading="lazy"`). El mosaico tiene cuatro
columnas en pantallas grandes.
Para personalizar el texto accesible, añade el contexto `alt` en los metadatos de la imagen;
el contexto `caption` se usa como título visible y, si falta, se reutiliza el texto alternativo.

Para agrupar las imágenes, asigna en Cloudinary el tag correspondiente a cada una:
`cultivo-arandano`, `cultivo-cucurbitaceas`, `cultivo-pasifloras`, `cultivo-pompon`,
`cultivo-papa`, `cultivo-zanahoria`, `cultivo-tomate`, `plantuladero`, `cultivo-fresas`,
`cultivo-platano`, `cultivo-uva`, `producto` o `logistica`. Las imágenes sin el tag de su
grupo no aparecerán en esa sección.

La consulta segura requiere estas variables en un archivo `.env` en la raíz del proyecto:

```env
PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
PUBLIC_CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

No compartas ni publiques `CLOUDINARY_API_SECRET`. Configura estas variables en Netlify para
que `/api/gallery.json` consulte Cloudinary desde el servidor sin exponer el secreto al
navegador. Las páginas normales siguen siendo estáticas; solo este endpoint se ejecuta en
servidor. En desarrollo, el mismo endpoint consulta Cloudinary usando las variables de `.env`.

## 📤 Portal de carga para el cliente

La página `/upload` usa el widget de carga de `astro-cloudinary` para seleccionar y cargar
imágenes directamente a Cloudinary. No aparece en la navegación del sitio. Añade a `.env`
la variable pública del preset sin firma:

```env
PUBLIC_CLOUDINARY_UPLOAD_PRESET=nombre_del_preset
```

En Cloudinary crea un upload preset **unsigned** dedicado para el cliente y configúralo para
guardar en `AGRIMATCO/images`. El widget permite imágenes JPG, PNG, WebP y AVIF, hasta 10 MB cada una
y 20 por selección. Configura también esos límites en el preset; las opciones del widget son
una ayuda de interfaz, no un control de seguridad. Para asignar un nombre distinto a cada
imagen, usa el campo **ID público** de **Opciones avanzadas** del widget.

`/upload` no tiene login: `noindex` y no incluir el enlace en el menú no restringen el acceso.
Cualquier persona que consiga el enlace puede cargar archivos usando el preset público.
Para proteger el acceso se necesita añadir autenticación. Al terminar de cargar, usa el enlace
**Ver galería**; allí se consultan las imágenes actuales de Cloudinary sin esperar una nueva
publicación.

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
| `npm run astro ...` | Run Astro CLI commands |

El adaptador de Netlify no admite `astro preview`; para validar el endpoint local usa
`npm run dev` y para revisar el build de producción usa un Deploy Preview de Netlify.

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
