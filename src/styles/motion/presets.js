/**
 * GSAP hero & interaction presets.
 * All functions are async — they dynamically import GSAP so the
 * bundle is never included in the SSR pass.
 *
 * Usage (inside useEffect):
 *   const cleanup = await heroReveal();
 *   return cleanup;
 */

/**
 * Loader letter-reveal → hero entrance.
 * Fires the 'w0rapit:loaded' custom event when the loader exits.
 *
 * @param {{ onComplete?: () => void }} [opts]
 * @returns {Promise<() => void>} cleanup function
 */
export async function runLoader({ onComplete } = {}) {
  const { default: gsap } = await import('gsap');

  gsap.set('[data-loader-char]', { y: 28, filter: 'blur(10px)', opacity: 0 });

  const tl = gsap.timeline({
    onComplete() {
      window.dispatchEvent(new CustomEvent('w0rapit:loaded'));
      onComplete?.();
    },
  });

  tl.to('[data-loader-char]', {
    opacity: 1, y: 0, filter: 'blur(0px)',
    duration: 0.55, stagger: 0.09, ease: 'power3.out',
  })
    .to('[data-loader-logo]', {
      scale: 1.04, duration: 0.28,
      ease: 'power2.inOut', yoyo: true, repeat: 1,
    }, '+=0.28')
    .to('[data-loader]', {
      opacity: 0, duration: 0.55, ease: 'power2.inOut',
      onComplete() {
        const el = document.querySelector('[data-loader]');
        if (el) { el.style.visibility = 'hidden'; el.style.pointerEvents = 'none'; }
        gsap.set('[data-loader-char]', { clearProps: 'filter' });
      },
    }, '+=0.14');

  return () => tl.kill();
}

/**
 * Hero section entrance — called after the loader exits.
 * Respects prefers-reduced-motion (caller should check).
 *
 * @returns {Promise<() => void>} cleanup function
 */
export async function heroReveal() {
  const { default: gsap } = await import('gsap');

  // Set initial y-offsets (opacity:0 is already in CSS via .js [data-gsap]).
  // Four-step sequence — name, headline, role, then the scroll cue —
  // each starting ~130ms after the last for a subtle, consistent
  // stagger rather than one big simultaneous reveal.
  gsap.set('[data-hero-name]',     { y: 16 });
  gsap.set('[data-hero-headline]', { y: 26 });
  gsap.set('[data-hero-role]',     { y: 18 });
  gsap.set('[data-hero-scroll]',   { y:  8 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .to('[data-hero-name]',     { opacity: 1, y: 0, duration: 0.48 }, 0.00)
    .to('[data-hero-headline]', { opacity: 1, y: 0, duration: 0.58, stagger: 0.08 }, 0.13)
    .to('[data-hero-role]',     { opacity: 1, y: 0, duration: 0.48, ease: 'power2.out' }, 0.42)
    .to('[data-hero-scroll]',   { opacity: 1, y: 0, duration: 0.40 }, 0.58);

  return () => tl.kill();
}

/**
 * Magnetic button hover effect using gsap.quickTo().
 * Attach to a button element; returns a cleanup function.
 *
 * @param {HTMLElement} el
 * @param {{ maxX?: number; maxY?: number }} [opts]
 * @returns {() => void} cleanup
 */
export async function magneticButton(el, { maxX = 8, maxY = 4 } = {}) {
  if (!el || typeof window === 'undefined') return () => {};

  const { default: gsap } = await import('gsap');
  const qx = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power2.out' });
  const qy = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power2.out' });

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    qx(((e.clientX - r.left) / r.width  - 0.5) * maxX * 2);
    qy(((e.clientY - r.top)  / r.height - 0.5) * maxY * 2);
  };
  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  };

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
  return () => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
    gsap.set(el, { x: 0, y: 0 });
  };
}

/**
 * Image zoom on hover (for project thumbnails).
 *
 * @param {HTMLElement} wrapper  — outer overflow:hidden container
 * @param {HTMLElement} inner    — the element to scale
 * @returns {() => void} cleanup
 */
export async function hoverZoom(wrapper, inner, { scale = 1.03 } = {}) {
  if (!wrapper || !inner) return () => {};
  const { default: gsap } = await import('gsap');

  const onEnter = () => gsap.to(inner, { scale, duration: 0.55, ease: 'power2.out' });
  const onLeave = () => gsap.to(inner, { scale: 1, duration: 0.55, ease: 'power2.out' });

  wrapper.addEventListener('mouseenter', onEnter);
  wrapper.addEventListener('mouseleave', onLeave);
  return () => {
    wrapper.removeEventListener('mouseenter', onEnter);
    wrapper.removeEventListener('mouseleave', onLeave);
  };
}
