/**
 * Con <ClientRouter /> el <body> se reemplaza en cada navegación, pero los
 * scripts empaquetados de Astro se ejecutan una sola vez.
 *
 * `onPageLoad` llama a `init` una vez por cada elemento nuevo que coincida con
 * `selector`: en la carga inicial y después de cada navegación, sin enganchar
 * dos veces el mismo elemento (`astro:page-load` también se dispara en la
 * carga inicial).
 */
export function onPageLoad<T extends Element = HTMLElement>(
  selector: string,
  init: (element: T) => void,
) {
  const bound = new WeakSet<Element>();

  const run = () => {
    const element = document.querySelector<T>(selector);
    if (!element || bound.has(element)) return;
    bound.add(element);
    init(element);
  };

  document.addEventListener('astro:page-load', run);
  // El script puede cargarse cuando `astro:page-load` ya se disparó.
  if (document.readyState !== 'loading') run();
}
