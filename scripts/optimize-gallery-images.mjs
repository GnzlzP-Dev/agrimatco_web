/**
 * Comprime las imágenes de la galería antes de commitearlas.
 *
 *   npm run gallery:optimize
 *
 * Lee de `incoming/` y escribe en `src/assets/gallery/`, siempre en JPEG.
 * Sobrescribe el archivo de salida si ya existe con el mismo nombre.
 *
 * Acepta .jpg .jpeg .png .webp .heic .heif (los iPhone guardan en HEIC).
 * Un archivo que no se pueda leer se reporta y se salta, sin cortar el lote.
 *
 * Por qué: las fotos llegan crudas desde el celular del cliente (3-5 MB).
 * Sin este paso el repositorio se infla y `astro:assets` procesa archivos
 * gigantes sin ganancia real, porque el peso se va en el origen.
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const SOURCE_DIR = 'incoming';
const OUTPUT_DIR = 'src/assets/gallery';

const MAX_WIDTH = 2000;
const QUALITY = 80;
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.heif']);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

if (!existsSync(SOURCE_DIR)) {
  console.log(`\n  No existe la carpeta "${SOURCE_DIR}/".`);
  console.log(`  Crea la carpeta y pon ahí las fotos que te envía el cliente.\n`);
  process.exit(0);
}

await mkdir(OUTPUT_DIR, { recursive: true });

// Los archivos ocultos (.gitkeep, .DS_Store) no son fotos del cliente.
const isImage = (entry) =>
  entry.isFile() &&
  !entry.name.startsWith('.') &&
  EXTENSIONS.has(extname(entry.name).toLowerCase());

const allFiles = await readdir(SOURCE_DIR, { withFileTypes: true });
const images = allFiles.filter(isImage);
const skipped = allFiles.filter(
  (entry) => entry.isFile() && !entry.name.startsWith('.') && !isImage(entry)
);

if (images.length === 0) {
  console.log(`\n  No hay imágenes en "${SOURCE_DIR}/".`);
  if (skipped.length > 0) {
    console.log(`  Se ignoraron ${skipped.length} archivo(s) con extensión no soportada:`);
    for (const file of skipped.slice(0, 8)) console.log(`    - ${file.name}`);
  }
  console.log(`  Formatos aceptados: ${[...EXTENSIONS].join(' ')}\n`);
  process.exit(0);
}

console.log(`\n  Optimizando ${images.length} imagen(es)\n`);

let failed = 0;

for (const file of images) {
  const input = join(SOURCE_DIR, file.name);
  const output = join(OUTPUT_DIR, `${basename(file.name, extname(file.name))}.jpg`);

  try {
    const before = (await stat(input)).size;

    const info = await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(output);

    // Una foto ya comprimida puede PESAR MÁS al reencodeear: se muestra
    // como aumento, no como una reducción con doble negativo.
    const delta = before - info.size;
    const pct = (delta / before) * 100;
    const cambio = delta >= 0 ? `-${pct.toFixed(0)}%` : `+${Math.abs(pct).toFixed(0)}%`;

    console.log(`  ${file.name}`);
    console.log(`    ${kb(before)} -> ${kb(info.size)}  (${info.width}x${info.height}, ${cambio})`);
  } catch (error) {
    failed += 1;
    console.log(`  ${file.name}`);
    console.log(`    ERROR: no se pudo procesar (${error.message})`);
  }
}

if (skipped.length > 0) {
  console.log(`\n  ${skipped.length} archivo(s) omitidos por extensión no soportada:`);
  for (const file of skipped.slice(0, 8)) console.log(`    - ${file.name}`);
  if (skipped.length > 8) console.log(`    ... y ${skipped.length - 8} más`);
}

if (failed > 0) {
  console.log(`\n  ${failed} imagen(es) fallaron. Revísalas antes de commitear.`);
}

console.log(`\n  Listo. Revisa las imágenes en ${OUTPUT_DIR}/ antes de commitear.\n`);
