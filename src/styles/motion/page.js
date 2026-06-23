/**
 * Page transition animations.
 * Integrate with Next.js router events or use as CSS-fallback.
 *
 * In Next.js App Router, wrapping <main> with PageWrapper handles
 * the enter animation automatically on mount.
 */

/**
 * Fade + rise entrance for a page element.
 *
 * @param {Element} el   — typically the <main> element
 * @returns {Promise<() => void>} cleanup
 */
export async function pageEnter(el) {
  if (!el || typeof window === 'undefined') return () => {};
  const { default: gsap } = await import('gsap');

  const tl = gsap.timeline();
  gsap.set(el, { opacity: 0, y: 12 });
  tl.to(el, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });

  return () => tl.kill();
}

/**
 * Fade exit for a page element (call before navigation).
 *
 * @param {Element} el
 * @returns {Promise<void>} resolves when animation completes
 */
export function pageExit(el) {
  return new Promise(async (resolve) => {
    if (!el || typeof window === 'undefined') return resolve();
    const { default: gsap } = await import('gsap');
    gsap.to(el, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: resolve });
  });
}
