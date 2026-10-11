export type GalleryEntry = {
  secureUrl: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  fullSrc: string;
  fullWidth: number;
  fullHeight: number;
};

export function cloudinaryImageUrl(secureUrl: string, width: number): string {
  if (!Number.isInteger(width) || width < 1) {
    throw new Error(`[gallery] Ancho de transformación Cloudinary inválido: ${width}`);
  }

  const url = new URL(secureUrl);
  const uploadPath = '/image/upload/';
  const uploadIndex = url.pathname.indexOf(uploadPath);

  if (url.hostname !== 'res.cloudinary.com' || uploadIndex === -1) {
    throw new Error(`[gallery] URL de imagen Cloudinary inválida: ${secureUrl}`);
  }

  const insertAt = uploadIndex + uploadPath.length;
  url.pathname = `${url.pathname.slice(0, insertAt)}f_auto,q_auto,c_limit,w_${width}/${url.pathname.slice(insertAt)}`;
  return url.toString();
}
