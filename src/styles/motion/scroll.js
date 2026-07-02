/**
 * Scroll-triggered reveal animations via GSAP ScrollTrigger.
 * Each function registers ScrollTrigger if not already registered,
 * returns a cleanup function that kills the trigger.
 *
 * Caller pattern (inside useEffect):
 *   const cleanup = await fadeUp(ref.current);
 *   return cleanup;
 *
 * `getGSAP` is also exported directly for components that need raw
 * gsap/ScrollTrigger access (custom timelines, scrub triggers) instead
 * of one of the canned presets below — one shared import+register
 * path instead of every call site re-importing and re-registering.
 */

export async function getGSAP() {
  const { default: gsap } = await import('gsap');
  const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

/**
 * Fade + slide-up entrance triggered on scroll.
 *
 * @param {Element | Element[]} targets
 * @param {{ start?: string; y?: number; duration?: number; stagger?: number }} [opts]
 * @returns {Promise<() => void>} cleanup
 */
export async function fadeUp(targets, {
  start    = 'top 86%',
  y        = 28,
  duration = 0.6,
  stagger  = 0,
} = {}) {
  const { gsap, ScrollTrigger } = await getGSAP();
  const els = Array.isArray(targets) ? targets : [targets];
  if (!els[0]) return () => {};

  gsap.set(els, { opacity: 0, y });

  const trigger = ScrollTrigger.create({
    trigger: els[0],
    start,
    once: true,
    onEnter() {
      gsap.to(els, { opacity: 1, y: 0, duration, stagger, ease: 'power2.out', clearProps: 'transform' });
    },
  });

  return () => {
    trigger.kill();
    gsap.set(els, { clearProps: 'all' });
  };
}

/**
 * Full enter → center → leave scrub for featured project cards.
 *
 * Three-phase motion linked to scroll position via scrub lag for
 * inertial smoothing. `lag` is seconds — how long the visual animation
 * takes to catch up to scroll progress:
 *
 *   entering  y:+35vh  scale:0.72  rotateZ:+3°  (below, tilted right)
 *   center    y:0      scale:1     rotateZ: 0°   (settled, full size)
 *   leaving   y:-30vh  scale:0.78  rotateZ:-2°  (above, tilted left)
 *
 * Also manages inner-image parallax: image drifts -24px→+24px and
 * settles from 1.05→1 scale as the card transits the viewport.
 *
 * `will-change` is set only while the trigger is active and cleared on
 * both enter and leave to avoid promoting layers unnecessarily.
 *
 * scrub is a number (lag in seconds), not `true` — GSAP smooths the
 * tween's catch-up to the scroll position instead of snapping 1:1 to
 * it, which is what gives the motion its soft, inertial feel. This is
 * still 100% scroll-driven (no wheel/touch listeners, no
 * preventDefault) — native scroll stays the source of truth.
 *
 * @param {Element}      target — .proj-card
 * @param {Element|null} artEl  — .proj-card__art (image parallax), or null
 * @param {{ lag?: number }} [opts]
 * @returns {Promise<() => void>} cleanup
 */
export async function cardScrub(target, artEl, { lag = 0.5 } = {}) {
  if (!target) return () => {};
  const { gsap, ScrollTrigger } = await getGSAP();

  // ponytail: use the parent proj-section (100vh) as trigger so the
  // 50%-progress mark maps exactly to section-center = card-center = viewport-center.
  const triggerEl = target.parentElement || target;

  gsap.set(target, { transformOrigin: 'center center' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top bottom',
      end:   'bottom top',
      scrub: lag,
      onToggleActive(self) {
        target.style.willChange = self.isActive ? 'transform, opacity' : 'auto';
      },
    },
  });

  // Enter: arrives from below, tilted clockwise
  tl.fromTo(target,
    { y: '35vh', scale: 0.72, rotateZ: 3,  opacity: 0.85 },
    { y: 0,      scale: 1,    rotateZ: 0,  opacity: 1,   ease: 'none', duration: 1 },
  );
  // Leave: exits upward, tilted counter-clockwise
  tl.to(target,
    { y: '-30vh', scale: 0.78, rotateZ: -2, opacity: 0.85, ease: 'none', duration: 1 },
  );

  // Inner image parallax
  let imageTween = null;
  if (artEl) {
    imageTween = gsap.fromTo(artEl,
      { y: -24, scale: 1.05 },
      {
        y: 24, scale: 1, ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top bottom',
          end:   'bottom top',
          scrub: true,
        },
      },
    );
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
    imageTween?.scrollTrigger?.kill();
    imageTween?.kill();
    gsap.set(target, { clearProps: 'all' });
    if (artEl) gsap.set(artEl, { clearProps: 'transform' });
  };
}
