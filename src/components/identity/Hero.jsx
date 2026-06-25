'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Hero section — full-viewport intro with loader-coordinated entrance.
 * Listens for the 'w0rapit:loaded' event dispatched by PageWrapper.
 */
export default function Hero() {
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Must toggle both ways — scrolling back to the top has to bring the
    // CTA back, not just hide it once and never re-show it.
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('js');

    if (prefersReduced) {
      document.querySelectorAll('[data-gsap]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    let tl;
    let cancelled = false;
    let fallbackId = null;

    const reveal = async () => {
      if (cancelled) return;
      const { heroReveal } = await import('../../styles/motion/presets');
      if (cancelled) return;
      tl = await heroReveal();
    };

    const onLoaded = () => {
      if (fallbackId) window.clearTimeout(fallbackId);
      reveal();
    };

    // 'w0rapit:loaded' is dispatched once per session by PageWrapper's loader.
    // On revisits to Home (nav click, back/forward, route remount) that event
    // has already fired and won't fire again — reveal immediately instead of
    // waiting forever. A timeout also guards against the event being missed.
    if (window.__w0rapitLoaded) {
      reveal();
    } else {
      window.addEventListener('w0rapit:loaded', onLoaded, { once: true });
      fallbackId = window.setTimeout(onLoaded, 4000);
    }

    return () => {
      cancelled = true;
      window.removeEventListener('w0rapit:loaded', onLoaded);
      if (fallbackId) window.clearTimeout(fallbackId);
      tl?.kill?.();
    };
  }, [prefersReduced]);

  return (
    <section className="hero" id="home" aria-labelledby="hero-h1">
      {/* Atmospheric background glows */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__glow-br" />
        <div className="hero__glow-tl" />
      </div>

      <div className="wrap" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div className="g12">
          <div className="hero__body">

            {/* Identity meta */}
            <div className="hero__identity" data-gsap="" data-hero-avail="">
              <span className="hero__name">Worapit M.</span>
              <span className="hero__location">Based in Thailand</span>
            </div>

            {/* Main headline — two-part sentence */}
            <h1 className="hero__h1" id="hero-h1">
              <span className="hero__line1" data-gsap="" data-hero-line1="">
                Digital Product Designer,
              </span>
              <span className="hero__line2" data-gsap="" data-hero-line2="">
                bridging user needs and business goals through thoughtful experiences.
              </span>
            </h1>

            <p className="hero__status" data-gsap="" data-hero-desc="">
              Currently designing PropTech products at Livinginsider.
            </p>
            <p className="hero__opportunity" data-gsap="" data-hero-tag="">
              ✸ Open to Full-time &amp; Freelance Opportunities
            </p>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#work"
        className={`hero__indicator${scrolled ? ' hero__indicator--hidden' : ''}`}
        aria-label="Explore projects"
      >
        <span className="hero__indicator-txt">Explore Selected Work</span>
        <span className="hero__indicator-chevrons" aria-hidden="true">
          {[0, 1].map((i) => (
            <svg
              key={i}
              className="hero__indicator-chevron"
              style={{ '--i': i }}
              width="14" height="14" viewBox="0 0 16 16" fill="none"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          ))}
        </span>
      </a>
    </section>
  );
}
