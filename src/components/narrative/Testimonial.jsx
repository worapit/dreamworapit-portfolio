'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { BREAKPOINT_MD } from '../../lib/breakpoints';

const AVATAR_COLORS = {
  blue:   'av-blue',
  purple: 'av-purple',
  teal:   'av-teal',
};

/**
 * Testimonial card with scroll-triggered reveal and subtle hover lift.
 *
 * Props:
 *  quote     string
 *  name      string
 *  role      string
 *  initials  string  (e.g. "SC")
 *  color     'blue' | 'purple' | 'teal'
 */
export default function Testimonial({ quote, name, role, initials, color = 'blue' }) {
  const cardRef = useRef(null);
  const prefersReduced = useReducedMotion();

  // Scroll fade-up reveal
  useEffect(() => {
    if (prefersReduced || !cardRef.current) return;
    let cleanup = () => {};
   import('../../styles/motion/scroll').then(({ fadeUp }) => {
      fadeUp(cardRef.current, { y: 30, duration: 0.6, start: 'top 87%' })
        .then((fn) => { cleanup = fn; });
    });
    return () => cleanup();
  }, [prefersReduced]);

  // Hover lift (desktop)
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    if (window.innerWidth < BREAKPOINT_MD) return;
    const el = cardRef.current;
    if (!el) return;

    let gsap;
    (async () => {
      gsap = (await import('gsap')).default;
    })();

    const onEnter = () => gsap?.to(el, { y: -4, duration: 0.28, ease: 'power2.out' });
    const onLeave = () => gsap?.to(el, { y:  0, duration: 0.28, ease: 'power2.out' });

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [prefersReduced]);

  return (
    <article ref={cardRef} className="testi-card" role="listitem">
      <div className="testi-card__qmark" aria-hidden="true">&ldquo;</div>
      <blockquote className="testi-card__quote">{quote}</blockquote>
      <footer className="testi-card__author">
        <div
          className={`testi-card__avatar ${AVATAR_COLORS[color] ?? 'av-blue'}`}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="testi-card__name">{name}</p>
          <p className="testi-card__role">{role}</p>
        </div>
      </footer>
    </article>
  );
}
