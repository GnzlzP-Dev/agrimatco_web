export const GALLERY_CATEGORIES = [
  /*{
    id: 'cultivo-arandano',
    label: 'Cultivo arándano',
    tag: 'cultivo-arandano',
    description: 'Conoce el manejo y desarrollo de nuestros cultivos de arándano.',
  },
  {
    id: 'cultivo-cucurbitaceas',
    label: 'Cultivo cucurbitáceas',
    tag: 'cultivo-cucurbitaceas',
    description: 'Imágenes de cultivos de cucurbitáceas y su desarrollo en campo.',
  },
  {
    id: 'cultivo-pasifloras',
    label: 'Cultivo pasifloras',
    tag: 'cultivo-pasifloras',
    description: 'Experiencias y resultados en cultivos de pasifloras.',
  },*/
  {
    id: 'cultivo-pompon',
    label: 'Cultivo pompón',
    tag: 'cultivo-pompon',
    description: 'Producción, desarrollo y manejo de cultivo de pompón.',
  },
  {
    id: 'cultivo-pepino',
    label: 'Cultivo pepino',
    tag: 'cultivo-pepino',
    description: 'Manejo y desarrollo de cultivos de pepino en campo.',
  },/*
  {
    id: 'cultivo-papa',
    label: 'Cultivo papa',
    tag: 'cultivo-papa',
    description: 'Acompañamiento y resultados en cultivos de papa.',
  },*/
  {
    id: 'cultivo-zanahoria',
    label: 'Cultivo zanahoria',
    tag: 'cultivo-zanahoria',
    description: 'Imágenes de parcelas y procesos en cultivos de zanahoria.',
  },
  {
    id: 'cultivo-tomate',
    label: 'Cultivo tomate',
    tag: 'cultivo-tomate',
    description: 'Manejo y desarrollo de cultivos de tomate en campo.',
  },/*
  {
    id: 'plantuladero',
    label: 'Plántuladero',
    tag: 'plantuladero',
    description: 'Conoce el trabajo y cuidado de las plántulas desde su origen.',
  },
  {
    id: 'cultivo-fresas',
    label: 'Cultivo fresas',
    tag: 'cultivo-fresas',
    description: 'Experiencias de producción y manejo de cultivos de fresa.',
  },
  {
    id: 'cultivo-platano',
    label: 'Cultivo plátano',
    tag: 'cultivo-platano',
    description: 'Imágenes de cultivos de plátano y su desarrollo.',
  },
  {
    id: 'cultivo-uva',
    label: 'Cultivo uva',
    tag: 'cultivo-uva',
    description: 'Manejo y resultados en cultivos de uva.',
  },*/
  {
    id: 'producto-logistica',
    label: 'Producto y logística',
    tag: 'producto-logistica',
    description: 'Productos y soluciones de nutrición vegetal de Agrimatco.',
  },
] as const;

export type GalleryCategoryId = (typeof GALLERY_CATEGORIES)[number]['id'];

export const isGalleryCategoryId = (value: string): value is GalleryCategoryId =>
  GALLERY_CATEGORIES.some((category) => category.id === value);

export const getGalleryCategory = (id: GalleryCategoryId) =>
  GALLERY_CATEGORIES.find((category) => category.id === id)!;
