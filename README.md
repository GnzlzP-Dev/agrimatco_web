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
│   ├── gallery/         # Fotos de la galería
│   │   └── posters/     # Posters de los videos de YouTube
│   ├── products/        # PNG de la línea Cultivar
│   └── ui/
│       ├── brand/       # Logos
│       ├── markers/     # Pin del mapa (WebP optimizado)
│       └── socials/     # Íconos de redes sociales
├── components/
│   ├── layout/          # Header, Footer
│   ├── gallery/         # Gallery, GalleryTile, Lightbox
│   ├── sections/        # Bloques de la landing
│   └── ui/              # Piezas reusables
├── data/                # Datos tipados (gallery.ts)
├── layouts/             # Layouts reutilizables
├── pages/               # Rutas del sitio
└── styles/              # Tailwind + tokens de marca

public/                  # Solo lo que NO se procesa: favicon, fuentes, robots.txt
_archive/                # Material sin uso. Queda en git pero NO se despliega
scripts/                 # Utilidades de desarrollo
incoming/                # Fotos crudas del cliente (no se commitea)
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
| Videos | YouTube no listado | Solo el poster se optimiza |
| Posters de video | `src/assets/gallery/posters/` | ✅ |
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

## 🖼️ Cómo agregar fotos a la galería

1. El cliente deja las fotos crudas en `incoming/`
2. `npm run gallery:optimize` → las comprime a máx. 2000 px / JPEG 80 en `src/assets/gallery/`
3. Declaras cada imagen en `src/data/gallery.ts`:

```ts
{
  type: 'image',
  file: 'nombre-archivo.jpg',   // el de la carpeta gallery/
  alt: 'Descripción obligatoria para accesibilidad y SEO',
  title: 'Texto que se ve en el lightbox',  // opcional
}
```

4. Para un video: súbelo a YouTube como **no listado**, pon el poster en
   `src/assets/gallery/posters/` y declara `type: 'video'` con `videoId` y `poster`.

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
| `npm run gallery:optimize` | Comprime `incoming/` hacia `src/assets/gallery/` |
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
