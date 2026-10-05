import type { ImageMetadata } from 'astro';

/**
 * Fuente única de datos de la galería.
 *
 * Las imágenes se resuelven por nombre de archivo contra `src/assets/gallery/`.
 * Astro las importa en build y `<Image />` genera AVIF/WebP con `srcset`.
 */

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/gallery/**/*.{jpg,jpeg,png,avif,webp}',
  { eager: true }
);

const byFilename = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(modules)) {
  const name = path.split('/').pop();
  if (name) byFilename.set(name, mod.default);
}

export function asset(filename: string): ImageMetadata {
  const found = byFilename.get(filename);
  if (!found) {
    const available = [...byFilename.keys()].join(', ') || '(ninguna)';
    throw new Error(
      `[gallery] No existe la imagen "${filename}" en src/assets/gallery/. Disponibles: ${available}`
    );
  }
  return found;
}

export type GalleryItem = {
  /** 'image' muestra la foto. 'video' muestra un poster que abre YouTube. */
  type: 'image' | 'video';
  /** Nombre del archivo en src/assets/gallery/ */
  file: string;
  /** Texto alternativo. Obligatorio: accesibilidad y SEO. */
  alt: string;
  /** Texto visible en el lightbox. Si falta se usa `alt`. */
  title?: string;
  /** Solo type:'video'. ID de YouTube de un video NO LISTADO. */
  videoId?: string;
  /** Solo type:'video'. Poster en src/assets/gallery/posters/ */
  poster?: string;
  date?: string;
};

/** Un item de galería ya enriquecido con la versión grande para el lightbox. */
export type GalleryEntry = GalleryItem & {
  fullSrc: string;
  fullWidth: number;
  fullHeight: number;
};

export const gallery: GalleryItem[] = [
  // ─── Contenido de demostración ────────────────────────────────────────────
  // Estas 4 imágenes son placeholders para revisar el diseño.
  // Reemplázalas por las fotos reales y quita este bloque.
  { type: 'image', file: 'field-1.jpg', alt: 'Campo de siembra', title: 'Campo de siembra' },
  { type: 'image', file: 'field-2.jpg', alt: 'Campo de cultivo', title: 'Campo de cultivo' },
  { type: 'image', file: 'field-3.jpg', alt: 'Campo cultivado', title: 'Campo cultivado' },
  { type: 'image', file: 'product-in-farm.jpg', alt: 'Productos aplicados en campo', title: 'Productos aplicados en campo' },
  { type: 'image', file: 'farm.jpg', alt: 'Nuestros colaboradores', title: 'Nuestros colaboradores' },
  { type: 'image', file: 'results.jpg', alt: 'Resultados de la aplicación', title: 'Resultados de la aplicación' },

  // ─── Ejemplo de video ────────────────────────────────────────────────────
  // El ID de abajo es un placeholder: cámbialo por el de un video real tuyo.
  // Para obtenerlo: sube el video a YouTube como "no listado" y copia lo que
  // va después de `youtube.com/watch?v=`.
  {
    type: 'video',
    file: 'demo-producto.jpg',
    poster: 'poster-demo.jpg',
    videoId: 'aqz-KE-bpKQ',
    alt: 'Video de la aplicación de Cultivar paste en campo',
    title: 'Cultivar paste en acción',
  },
];
