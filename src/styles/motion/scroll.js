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
 * Scale + rise + fade entrance triggered on scroll — for the
 * full-screen project case sections. Subtle and independent of any
 * scroll-position tracking elsewhere: this only ever fires once, the
 * first time a card scrolls into view, regardless of how it got there
 * (native scroll, scroll-snap settling, or a dot click).
 *
 * @param {Element} target
 * @param {{ start?: string; fromScale?: number; fromOpacity?: number; y?: number; duration?: number }} [opts]
 * @returns {Promise<() => void>} cleanup
 */
export async function scaleReveal(target, {
  start       = 'top 82%',
  fromScale   = 0.985,
  fromOpacity = 0.9,
  y           = 24,
  duration    = 0.6,
} = {}) {
  if (!target) return () => {};
  const { gsap, ScrollTrigger } = await getGSAP();
  const { CustomEase } = await import('gsap/CustomEase');
  gsap.registerPlugin(CustomEase);
  const ease = CustomEase.create('projectEnter', '0.22, 1, 0.36, 1');

  gsap.set(target, { opacity: fromOpacity, scale: fromScale, y });

  const trigger = ScrollTrigger.create({
    trigger: target,
    start,
    once: true,
    onEnter() {
      gsap.to(target, {
        opacity: 1, scale: 1, y: 0, duration, ease,
        clearProps: 'transform',
      });
    },
  });

  return () => {
    trigger.kill();
    gsap.set(target, { clearProps: 'all' });
  };
}
