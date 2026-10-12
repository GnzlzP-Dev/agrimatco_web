/**
 * Enlace a una sección de la home. En la home basta el ancla; en el resto de
 * páginas hay que volver a la home para que el ancla resuelva.
 */
export const sectionHref = (pathname: string, anchor: string) =>
  pathname === '/' ? anchor : `/${anchor}`;
