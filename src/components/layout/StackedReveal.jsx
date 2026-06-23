'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * StackedReveal — layered scroll transition between Work and Contact.
 *
 * The CSS in globals.css already makes Work appear "above" Contact via:
 *   - z-index: 2 on .work (solid bg, rounded bottom, shadow)
 *   - z-index: 1 on .contact-section with margin-top: -2rem (peeks under Work)
 *
 * This component adds the GSAP motion layer:
 *   - On desktop: Contact starts 80px below its natural position and
 *     rises to y:0 as it enters the viewport, creating the feeling that
 *     it is emerging from underneath the Work section.
 *   - On mobile or reduced-motion: no animation; layout is fully normal.
 */
export default function StackedReveal({ children }) {
  const wrapRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 767px)').matches) return;

    let ctx = null;
    let cancelled = false;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const contact = wrapRef.current?.querySelector('#contact');
        if (!contact) return;

        // Contact rises up from 80px below its layout position as it
        // scrolls from the bottom of the viewport to 40% from the top.
        gsap.fromTo(
          contact,
          { y: 80 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: contact,
              start: 'top bottom',  // when contact top hits viewport bottom
              end:   'top 40%',     // when contact top reaches 40% of viewport
              scrub: 1.8,           // smooth lag for premium feel
            },
          }
        );
      }, wrapRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [prefersReduced]);

  return <div ref={wrapRef}>{children}</div>;
}
