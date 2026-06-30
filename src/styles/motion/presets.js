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
 * Loader logo stroke-draw → hero entrance. Animation only — the
 * caller (PageWrapper) owns side effects (hiding the loader, body
 * scroll lock, the 'w0rapit:loaded' event) via `onComplete`, so
 * there's a single place that decides what "done" means.
 *
 * Draws each path of the w0 logo via native SVG
 * stroke-dasharray/dashoffset (getTotalLength — no DrawSVG plugin
 * needed), crossfades stroke → fill, winks a small sparkle on the
 * right, then fades the whole loader out. ~2.1s total.
 *
 * @param {HTMLElement} loaderEl
 * @param {{ onComplete?: () => void }} [opts]
 * @returns {Promise<() => void>} cleanup function
 */
const LOGO_FILL_OPACITY = [1, 1, 0.5]; // third path is the logo's accent arc

export async function runLoader(loaderEl, { onComplete } = {}) {
  if (!loaderEl) return () => {};
  const { default: gsap } = await import('gsap');

  const logo    = loaderEl.querySelector('[data-loader-logo]');
  const paths   = loaderEl.querySelectorAll('[data-loader-path]');
  const sparkle = loaderEl.querySelector('[data-loader-sparkle]');
  const lengths = Array.from(paths).map((p) => p.getTotalLength());

  gsap.set(logo, { opacity: 0, scale: 0.96 });
  gsap.set(paths, {
    fillOpacity: 0,
    strokeOpacity: 1,
    strokeDasharray: (i) => lengths[i],
    strokeDashoffset: (i) => lengths[i],
  });
  gsap.set(sparkle, { opacity: 0, scale: 0, rotate: -15 });

  const tl = gsap.timeline({ onComplete });
  tl.to(logo, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' })
    .to(paths, {
      strokeDashoffset: 0, duration: 0.85, stagger: 0.12, ease: 'power2.inOut',
    }, 0.08)
    .to(paths, {
      fillOpacity: (i) => LOGO_FILL_OPACITY[i], strokeOpacity: 0,
      duration: 0.3, ease: 'power1.out',
    }, '-=0.2')
    // Sparkle wink — quick in, brief hold, quick out, not a slow fade.
    .to(sparkle, { opacity: 1, scale: 1, rotate: 0, duration: 0.22, ease: 'back.out(2.4)' }, '+=0.02')
    .to(sparkle, { opacity: 0, scale: 0.4, duration: 0.2, ease: 'power1.in' }, '+=0.08')
    .to(loaderEl, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, '+=0.12');

  return () => {
    tl.kill();
    gsap.set(paths, { clearProps: 'all' });
  };
}

/**
 * Hero section entrance — called after the loader exits.
 * Respects prefers-reduced-motion (caller should check).
 *
 * Six-beat sequence (nav/logo are already visible, no animation
 * needed there): name → headline lines (clip-reveal) → rotating word
 * → supporting text → scroll cue. Each beat is a subtle y+opacity
 * move; the headline also unmasks via clip-path for a quieter,
 * premium "rising into place" read instead of a plain fade.
 *
 * @returns {Promise<() => void>} cleanup function
 */
export async function heroReveal() {
  const { default: gsap } = await import('gsap');

  // Set initial states (opacity:0 is already in CSS via .js [data-gsap]).
  gsap.set('[data-hero-name]',     { y: 16 });
  gsap.set('[data-hero-headline]', { y: 26, clipPath: 'inset(0% 0% 100% 0%)' });
  gsap.set('[data-hero-word]',     { y: 10 });
  gsap.set('[data-hero-role]',     { y: 18 });
  gsap.set('[data-hero-scroll]',   { y:  8 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .to('[data-hero-name]',     { opacity: 1, y: 0, duration: 0.48 }, 0.00)
    .to('[data-hero-headline]', {
      opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.64, stagger: 0.1, ease: 'power3.out',
    }, 0.14)
    .to('[data-hero-word]',     { opacity: 1, y: 0, duration: 0.4 }, 0.62)
    .to('[data-hero-role]',     { opacity: 1, y: 0, duration: 0.48, ease: 'power2.out' }, 0.74)
    .to('[data-hero-scroll]',   { opacity: 1, y: 0, duration: 0.40 }, 0.92);

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
 * Water-droplet cursor repulsion for the Hero background — droplets
 * within `radius` of the cursor ease away from it (gsap.quickTo, same
 * technique as magneticButton above), settling back to rest once the
 * cursor moves on. Only ever touches `.hero__droplet-inner` elements —
 * the ambient upward float lives on their parent `.hero__droplet` via
 * a separate CSS animation, so the two never fight over transform.
 *
 * @param {HTMLElement} container — wraps the `.hero__droplet` spans
 * @param {{ radius?: number; maxOffset?: number }} [opts]
 * @returns {Promise<() => void>} cleanup
 */
export async function dropletRepulsion(container, { radius = 140, maxOffset = 16 } = {}) {
  if (!container || typeof window === 'undefined') return () => {};
  const { default: gsap } = await import('gsap');

  const inners = Array.from(container.querySelectorAll('.hero__droplet-inner'));
  if (!inners.length) return () => {};

  const setters = inners.map((el) => ({
    x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
  }));

  const onMove = (e) => {
    inners.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const dx = (r.left + r.width / 2) - e.clientX;
      const dy = (r.top + r.height / 2) - e.clientY;
      const dist = Math.hypot(dx, dy);
      if (dist < radius && dist > 0.01) {
        const strength = (1 - dist / radius) * maxOffset;
        setters[i].x((dx / dist) * strength);
        setters[i].y((dy / dist) * strength);
      } else {
        setters[i].x(0);
        setters[i].y(0);
      }
    });
  };

  document.addEventListener('mousemove', onMove, { passive: true });
  return () => {
    document.removeEventListener('mousemove', onMove);
    gsap.set(inners, { clearProps: 'transform' });
  };
}
