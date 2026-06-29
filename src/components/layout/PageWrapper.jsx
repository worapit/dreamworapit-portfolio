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

    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const { runLoader } = await import('../../styles/motion/presets');
      if (cancelled) return;
      cleanup = await runLoader(loader, { onComplete: done });
    })();

    return () => {
      cancelled = true;
      cleanup();
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
