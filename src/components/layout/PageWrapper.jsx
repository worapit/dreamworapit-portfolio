'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const LOADER_CHARS = ['w', '0', 'r', 'a', 'p', 'i', 't', '.'];

/**
 * PageWrapper — renders the full-screen loader overlay and
 * orchestrates the load → hero entrance sequence.
 *
 * Mount behaviour:
 *  1. Shows loader (full-screen, same bg as site)
 *  2. Reveals "w0rapit." letter by letter via GSAP
 *  3. Scale pulse on the logo
 *  4. Fades loader out
 *  5. Fires custom event 'w0rapit:loaded' — Hero listens for this
 *
 * If prefers-reduced-motion: hides loader immediately, fires event.
 */
export default function PageWrapper({ children }) {
  const prefersReduced = useReducedMotion();
  const loaderRef      = useRef(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    // Prevent scroll during loader
    document.body.style.overflow = 'hidden';

    const done = () => {
      document.body.style.overflow = '';
      loader.style.visibility   = 'hidden';
      loader.style.pointerEvents = 'none';
      // Flag the loader as complete for the rest of the session so
      // components mounted later (e.g. Hero on a return visit to Home)
      // don't wait on an event that only fires once.
      window.__w0rapitLoaded = true;
      window.dispatchEvent(new CustomEvent('w0rapit:loaded'));
    };

    if (prefersReduced) {
      // No animation — instant done
      loader.style.opacity = '0';
      done();
      return;
    }

    let tl;
    (async () => {
      const { default: gsap } = await import('gsap');
      const chars = loader.querySelectorAll('[data-loader-char]');
      const logo  = loader.querySelector('[data-loader-logo]');

      gsap.set(chars, { y: 28, filter: 'blur(10px)', opacity: 0 });

      tl = gsap.timeline({ onComplete: done });
      tl
        .to(chars, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.55, stagger: 0.09, ease: 'power3.out',
        })
        .to(logo, {
          scale: 1.04, duration: 0.28,
          ease: 'power2.inOut', yoyo: true, repeat: 1,
        }, '+=0.28')
        .to(loader, {
          opacity: 0, duration: 0.55, ease: 'power2.inOut',
          onComplete: () => gsap.set(chars, { clearProps: 'filter' }),
        }, '+=0.14');
    })();

    return () => {
      tl?.kill();
      document.body.style.overflow = '';
    };
  }, [prefersReduced]);

  return (
    <>
      {/* Loader overlay */}
      <div
        ref={loaderRef}
        data-loader=""
        className="loader"
        role="progressbar"
        aria-label="Loading w0rapit portfolio"
        aria-valuetext="Loading"
      >
        <div className="loader__logo" data-loader-logo="" aria-hidden="true">
          {LOADER_CHARS.map((char, i) => (
            <span
              key={i}
              data-loader-char=""
              className={`loader__char${char === '.' ? ' loader__dot' : ''}`}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Page content */}
      {children}
    </>
  );
}
