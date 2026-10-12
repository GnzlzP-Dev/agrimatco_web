import type { APIRoute } from 'astro';

import { getCloudinaryGallery, PAGE_SIZE } from '../../data/cloudinary-gallery';
import { GALLERY_CATEGORIES, isGalleryCategoryId } from '../../data/gallery-categories';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const category = url.searchParams.get('category') ?? GALLERY_CATEGORIES[0].id;
  if (!isGalleryCategoryId(category)) {
    return Response.json({ error: 'La categoría solicitada no es válida.' }, { status: 400 });
  }
  const limit = Number(url.searchParams.get('limit') ?? PAGE_SIZE);
  if (!Number.isInteger(limit) || limit < 1 || limit > PAGE_SIZE) {
    return Response.json({ error: 'El límite solicitado no es válido.' }, { status: 400 });
  }
  const development = import.meta.env.DEV;

  return getCloudinaryGallery(
    {
      cloudName: development
        ? import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME
        : process.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: development
        ? import.meta.env.PUBLIC_CLOUDINARY_API_KEY
        : process.env.PUBLIC_CLOUDINARY_API_KEY,
      apiSecret: development
        ? import.meta.env.CLOUDINARY_API_SECRET
        : process.env.CLOUDINARY_API_SECRET,
    },
    category,
    cursor,
    limit,
  );
};
