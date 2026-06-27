/**
 * Scroll-triggered reveal animations via GSAP ScrollTrigger.
 * Each function registers ScrollTrigger if not already registered,
 * returns a cleanup function that kills the trigger.
 *
 * Caller pattern (inside useEffect):
 *   const cleanup = await fadeUp(ref.current);
 *   return cleanup;
 */

async function getGSAP() {
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
 * Scale + fade entrance triggered on scroll — for the full-screen
 * project case sections. Deliberately restrained (no slide/rotation):
 * just scale 0.92 → 1 and opacity 0 → 1, once, as the card enters view.
 *
 * @param {Element} target
 * @param {{ start?: string; fromScale?: number; duration?: number }} [opts]
 * @returns {Promise<() => void>} cleanup
 */
export async function scaleReveal(target, {
  start     = 'top 82%',
  fromScale = 0.92,
  duration  = 0.7,
} = {}) {
  if (!target) return () => {};
  const { gsap, ScrollTrigger } = await getGSAP();

  gsap.set(target, { opacity: 0, scale: fromScale });

  const trigger = ScrollTrigger.create({
    trigger: target,
    start,
    once: true,
    onEnter() {
      gsap.to(target, {
        opacity: 1, scale: 1, duration, ease: 'power2.out',
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
 * Staggered reveal for a grid of children.
 *
 * @param {Element} container
 * @param {{ selector?: string; stagger?: number; y?: number }} [opts]
 * @returns {Promise<() => void>} cleanup
 */
export async function staggerReveal(container, {
  selector = ':scope > *',
  stagger  = 0.10,
  y        = 30,
} = {}) {
  if (!container) return () => {};
  const { gsap, ScrollTrigger } = await getGSAP();
  const items = Array.from(container.querySelectorAll(selector));
  if (!items.length) return () => {};

  gsap.set(items, { opacity: 0, y });
  const trigger = ScrollTrigger.create({
    trigger: container,
    start: 'top 87%',
    once: true,
    onEnter() {
      gsap.to(items, {
        opacity: 1, y: 0, duration: 0.6, stagger, ease: 'power2.out',
        clearProps: 'transform',
      });
    },
  });

  return () => trigger.kill();
}

/**
 * Slide-in from left or right (for alternating project rows).
 *
 * @param {Element} imgEl
 * @param {Element} infoEl
 * @param {boolean} [alt] — if true, img is on the right
 * @returns {Promise<() => void>} cleanup
 */
export async function slideInRow(imgEl, infoEl, alt = false) {
  if (!imgEl || !infoEl) return () => {};
  const { gsap, ScrollTrigger } = await getGSAP();

  // Pre-initialise to hidden state BEFORE the trigger fires so elements
  // are never visible-then-snapped-to-invisible when onEnter runs.
  gsap.set(imgEl,  { opacity: 0, x: alt ?  50 : -50 });
  gsap.set(infoEl, { opacity: 0, x: alt ? -50 :  50 });

  const trigger = ScrollTrigger.create({
    trigger: imgEl.closest('.proj-row') || imgEl,
    start: 'top 82%',
    once: true,
    onEnter() {
      gsap.to(imgEl,  {
        opacity: 1, x: 0, duration: 0.80, ease: 'power3.out',
        clearProps: 'transform',
      });
      gsap.to(infoEl, {
        opacity: 1, x: 0, duration: 0.80, delay: 0.14, ease: 'power3.out',
        clearProps: 'transform',
      });
    },
  });

  return () => {
    trigger.kill();
    // Restore visibility if trigger was killed before it fired
    gsap.set([imgEl, infoEl], { clearProps: 'all' });
  };
}

/**
 * Section header children staggered in.
 *
 * @param {Element} header
 * @returns {Promise<() => void>} cleanup
 */
export async function revealSectionHeader(header) {
  if (!header) return () => {};
  const { gsap, ScrollTrigger } = await getGSAP();

  const children = Array.from(header.children);
  gsap.set(children, { opacity: 0, y: 24 });

  const trigger = ScrollTrigger.create({
    trigger: header,
    start: 'top 86%',
    once: true,
    onEnter() {
      gsap.to(children, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        clearProps: 'transform',
      });
    },
  });

  return () => {
    trigger.kill();
    gsap.set(children, { clearProps: 'all' });
  };
}
