// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Nota: esta opción NO evita el 301 de Netlify. Netlify tiene activados los
  // "Pretty URLs" por defecto, que sirven /about/ y responden 301 a /about, y
  // su documentación aclara que eso no se puede desactivar con una regla de
  // redirect. Tampoco cambia el nombre de los archivos en dist/: Astro sigue
  // generando dist/about/index.html. La consecuencia práctica es que `dev` y
  // `preview` sirven rutas distintas a las de producción, así que conviene
  // probar contra un servidor que replique el 301.
  trailingSlash: 'never',
  image: {
    // Tailwind v4 usa cascade layers, que pierden contra los estilos sin capa de
    // Astro. Con esto en `true` las clases de Tailwind no aplican al <Image />.
    responsiveStyles: false,
    // Nota: no se define `layout`. En conjunto con los `widths` explícitos de
    // cada <Image /> generaba anchos duplicados (750/828/1080) que nadie
    // solicitaba. Cada imagen declara los suyos.
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
