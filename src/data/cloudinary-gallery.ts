import { cloudinaryImageUrl, type GalleryEntry, type GalleryPage } from './gallery';
import { getGalleryCategory, type GalleryCategoryId } from './gallery-categories';

export interface CloudinaryCredentials {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

export const PAGE_SIZE = 24;
const MAX_CURSOR_LENGTH = 4096;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseResource = (value: unknown): GalleryEntry => {
  if (
    !isRecord(value) ||
    typeof value.public_id !== 'string' ||
    typeof value.secure_url !== 'string' ||
    typeof value.width !== 'number' ||
    !Number.isFinite(value.width) ||
    value.width < 1 ||
    typeof value.height !== 'number' ||
    !Number.isFinite(value.height) ||
    value.height < 1
  ) {
    throw new Error('Cloudinary devolvió una imagen con datos incompletos.');
  }

  const publicId = value.public_id;
  const secureUrl = value.secure_url;
  const width = value.width;
  const height = value.height;
  const displayName = typeof value.display_name === 'string' ? value.display_name : publicId;
  const context = isRecord(value.context) ? value.context : {};
  const customContext = isRecord(context.custom) ? context.custom : {};
  const fallback = displayName
    .split('/')
    .pop()
    ?.replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim() || publicId;
  const alt = typeof customContext.alt === 'string' && customContext.alt.trim()
    ? customContext.alt.trim()
    : fallback;
  const title = typeof customContext.caption === 'string' && customContext.caption.trim()
    ? customContext.caption.trim()
    : alt;
  const fullWidth = Math.min(1600, width);
  const fullHeight = Math.round((fullWidth * height) / width);

  return {
    secureUrl,
    alt,
    title,
    width,
    height,
    fullSrc: cloudinaryImageUrl(secureUrl, fullWidth),
    fullWidth,
    fullHeight,
  };
};

export async function getCloudinaryGallery(
  { cloudName, apiKey, apiSecret }: CloudinaryCredentials,
  categoryId: GalleryCategoryId,
  cursor?: string | null,
  limit: number = PAGE_SIZE,
) {
  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[gallery] Faltan las credenciales de Cloudinary para actualizar la galería.');
    return Response.json({ error: 'Faltan credenciales de Cloudinary en la configuración del servidor.' }, { status: 500 });
  }

  if (cursor !== undefined && cursor !== null && (!cursor || cursor.length > MAX_CURSOR_LENGTH)) {
    return Response.json({ error: 'El cursor de paginación no es válido.' }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: `(asset_folder="AGRIMATCO/images" OR folder="AGRIMATCO/images") AND tags=${getGalleryCategory(categoryId).tag}`,
        sort_by: [{ created_at: 'desc' }],
        max_results: limit,
        with_field: 'context',
        ...(cursor ? { next_cursor: cursor } : {}),
      }),
    });
  } catch (error) {
    console.error('[gallery] No se pudo conectar con Cloudinary.', error);
    return Response.json({ error: 'No fue posible conectar con Cloudinary.' }, { status: 502 });
  }

  if (response.status === 401 || response.status === 403) {
    console.error(`[gallery] Cloudinary rechazó las credenciales con HTTP ${response.status}.`);
    return Response.json(
      { error: 'Cloudinary rechazó las credenciales. Revisa el nombre de cuenta, API Key y API Secret.' },
      { status: 502 },
    );
  }

  if (!response.ok) {
    console.error(`[gallery] Cloudinary respondió con HTTP ${response.status}.`);
    return Response.json({ error: `Cloudinary respondió con HTTP ${response.status}.` }, { status: 502 });
  }

  try {
    const result: unknown = await response.json();
    if (!isRecord(result) || !Array.isArray(result.resources)) {
      throw new Error('Cloudinary devolvió una respuesta inesperada.');
    }

    const page: GalleryPage = {
      items: result.resources.map(parseResource),
      nextCursor:
        typeof result.next_cursor === 'string' && result.next_cursor.length > 0
          ? result.next_cursor
          : null,
    };
    return Response.json(page, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=15, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('[gallery] No se pudo procesar la respuesta de Cloudinary.', error);
    return Response.json({ error: 'La respuesta de Cloudinary no es válida.' }, { status: 502 });
  }
}
