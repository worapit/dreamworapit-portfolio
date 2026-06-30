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
  fromScale   = 0.98,
  fromOpacity = 0.9,
  y           = 32,
  duration    = 0.9,
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

/**
 * Continuous scale/opacity dip as a card scrolls past its centered
 * resting position and starts exiting the top of the viewport.
 * Independent of scaleReveal above — starts from 'center center' so
 * its scrub window never overlaps scaleReveal's once-fired entrance
 * (which finishes well before the card reaches center).
 *
 * @param {Element} target
 * @param {{ toScale?: number; toOpacity?: number }} [opts]
 * @returns {Promise<() => void>} cleanup
 */
export async function cardLeave(target, {
  toScale   = 0.985,
  toOpacity = 0.9,
} = {}) {
  if (!target) return () => {};
  const { gsap, ScrollTrigger } = await getGSAP();

  const tween = gsap.to(target, {
    scale: toScale, opacity: toOpacity, ease: 'none',
    scrollTrigger: {
      trigger: target,
      start: 'center center',
      end: 'top top',
      scrub: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(target, { clearProps: 'scale,opacity' });
  };
}

/**
 * Subtle scroll-linked image parallax — y drifts and scale settles as
 * the card transits the viewport. `ease:'none'` since GSAP scrub
 * already ties progress 1:1 to scroll position; easing here would just
 * fight the scrub and feel laggy.
 *
 * @param {Element} target
 * @param {{ yFrom?: number; yTo?: number; scaleFrom?: number; scaleTo?: number }} [opts]
 * @returns {Promise<() => void>} cleanup
 */
export async function imageParallax(target, {
  yFrom     = -24,
  yTo       = 24,
  scaleFrom = 1.03,
  scaleTo   = 1,
} = {}) {
  if (!target) return () => {};
  const { gsap, ScrollTrigger } = await getGSAP();

  const tween = gsap.fromTo(target,
    { y: yFrom, scale: scaleFrom },
    {
      y: yTo, scale: scaleTo, ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(target, { clearProps: 'transform' });
  };
}
