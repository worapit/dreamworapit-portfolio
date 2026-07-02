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
 * Water-droplet loader sequence → hero entrance.
 *
 * Sequence (≈2.8s total):
 *  t=0.00  Droplet fades in 90px above center
 *  t=0.18  Droplet falls (ease-in, accelerating)
 *  t=0.90  Impact — drop squashes and disappears
 *  t=0.92  Three ripple rings expand outward
 *  t=0.93  Circular clip-path expands to reveal the w0 logo
 *  t=2.25  Loader fades out (0.55s)
 *
 * @param {HTMLElement} loaderEl
 * @param {{ onComplete?: () => void }} [opts]
 * @returns {Promise<() => void>} cleanup function
 */
export async function runLoader(loaderEl, { onComplete } = {}) {
  if (!loaderEl) return () => {};
  const { default: gsap } = await import('gsap');

  const drop  = loaderEl.querySelector('[data-loader-drop]');
  const ring1 = loaderEl.querySelector('[data-loader-ring="1"]');
  const ring2 = loaderEl.querySelector('[data-loader-ring="2"]');
  const ring3 = loaderEl.querySelector('[data-loader-ring="3"]');
  const logo  = loaderEl.querySelector('[data-loader-logo]');

  // ── Initial states ─────────────────────────────────────────────────
  // Drop: centered (xPercent/yPercent = -50%) but shifted 90px above.
  // Drop SVG viewBox 0 0 24 32 at CSS width 24px → height 32px.
  // Base of drop (y=30 in SVG) = 30/32 × 32 = 30px from top = 14px
  // below element center.  Landing y = -14 puts base exactly at scene
  // center (the logo position).
  if (drop) gsap.set(drop, { xPercent: -50, yPercent: -50, y: -90, opacity: 0 });
  if (ring1) gsap.set(ring1, { attr: { r: 0 }, opacity: 0 });
  if (ring2) gsap.set(ring2, { attr: { r: 0 }, opacity: 0 });
  if (ring3) gsap.set(ring3, { attr: { r: 0 }, opacity: 0 });
  if (logo)  gsap.set(logo,  { clipPath: 'circle(0px at 50% 50%)' });

  const tl = gsap.timeline({ onComplete });

  // ── Phase 1: droplet appears (0.00 – 0.20s) ───────────────────────
  tl.to(drop, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0);

  // ── Phase 2: droplet falls (0.18 – 0.90s) ─────────────────────────
  // ease: 'power2.in' = gentle start, fast finish (gravity)
  tl.to(drop, { y: -14, duration: 0.73, ease: 'power2.in' }, 0.18);

  // ── Phase 3: impact squash (0.90 – 1.02s) ─────────────────────────
  // transform-origin:center 93.75% in CSS makes scaleY collapse
  // toward the base (contact point), not the element center.
  tl.to(drop, {
    scaleX: 1.9, scaleY: 0.18, opacity: 0,
    duration: 0.12, ease: 'power3.in',
  }, 0.90);

  // ── Phase 4: ripple rings expand (0.92 – 2.25s) ───────────────────
  // Three rings staggered by 60ms; inner ring fastest, outer slowest.
  // r values in SVG units (the SVG viewBox is 320px so 1 SVG unit ≈ 1px).
  tl.fromTo(ring1,
    { attr: { r: 0 }, opacity: 0.65 },
    { attr: { r: 54 }, opacity: 0, duration: 1.0, ease: 'power1.out' },
    0.92,
  );
  tl.fromTo(ring2,
    { attr: { r: 0 }, opacity: 0.45 },
    { attr: { r: 82 }, opacity: 0, duration: 1.2, ease: 'power1.out' },
    0.98,
  );
  tl.fromTo(ring3,
    { attr: { r: 0 }, opacity: 0.28 },
    { attr: { r: 115 }, opacity: 0, duration: 1.4, ease: 'power1.out' },
    1.05,
  );

  // ── Phase 5: logo reveal via clip-path (0.93 – 2.05s) ─────────────
  // clip-path circle radius 180px fully covers the logo at any size
  // (logo max-width 160px → half-diagonal ≈ 94px; 180px is safe
  // headroom so the reveal never clips a corner).
  tl.to(logo, {
    clipPath: 'circle(180px at 50% 50%)',
    duration: 1.12, ease: 'power2.out',
  }, 0.93);

  // ── Phase 6: hold + fade out (2.25 – 2.80s) ───────────────────────
  tl.to(loaderEl, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 2.25);

  return () => {
    tl.kill();
    if (drop) gsap.set(drop, { clearProps: 'all' });
    if (logo) gsap.set(logo, { clearProps: 'clipPath' });
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
