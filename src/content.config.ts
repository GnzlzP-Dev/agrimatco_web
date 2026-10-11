// src/content.config.ts
import { defineCollection } from 'astro:content';
import { cldAssetsLoader } from 'astro-cloudinary/loaders';

const agrimatco = defineCollection({
  loader: cldAssetsLoader({
    folder: 'AGRIMATCO/images',
    context: true,
    limit: 500,
  }),
});

export const collections = {
  agrimatco,
};