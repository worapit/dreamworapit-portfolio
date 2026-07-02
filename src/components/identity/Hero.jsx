'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import RotatingWord from './RotatingWord';
import WaterBackground from './WaterBackground';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * Hero section — full-viewport intro with loader-coordinated entrance.
 * Listens for the 'w0rapit:loaded' event dispatched by PageWrapper.
 */
export default function Hero() {
  const prefersReduced = useReducedMotion();
  const indicatorRef = useRef(null);

  useEffect(() => {
    // Direct inline-style toggle (not a CSS class) — the entrance
    // animation also drives this element's opacity via GSAP inline
    // styles, which would otherwise out-specificity a CSS class toggle.
    // Using the same mechanism (inline style) for both means whichever
    // runs last simply wins, with no specificity fight.
    // Intentionally does NOT run on mount — at scrollY 0 there is nothing
    // to do, and firing immediately would stomp the entrance animation's
    // own opacity:0 starting state before it gets a chance to play.
    let wasHidden = false;
    const onScroll = () => {
      const hide = window.scrollY > window.innerHeight * 0.6;
      if (hide === wasHidden) return;
      wasHidden = hide;
      const el = indicatorRef.current;
      if (!el) return;
      el.style.opacity = hide ? '0' : '1';
      el.style.pointerEvents = hide ? 'none' : '';
    };
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

    let cleanup = () => {};
    let cancelled = false;
    let fallbackId = null;

    const reveal = async () => {
      if (cancelled) return;
      const { heroReveal } = await import('../../styles/motion/presets');
      if (cancelled) return;
      cleanup = await heroReveal();
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
      cleanup();
    };
  }, [prefersReduced]);

  return (
    <section className="hero" id="home" aria-labelledby="hero-h1">
      <WaterBackground />
      {/* Atmospheric background glows */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__glow-br" />
        <div className="hero__glow-tl" />
      </div>

      <div className="wrap hero__wrap">
        <div className="g12">
          <div className="hero__body">

            {/* 1. Name */}
            <div className="hero__identity" data-gsap="" data-hero-name="">
              <span className="hero__name">Worapit M.</span>
            </div>

            {/* 2. Headline — two fixed lines; "digital" is a live word
                carousel (digital/PropTech/EdTech). */}
            <h1 className="hero__h1" id="hero-h1">
              <span className="hero__headline-line" data-gsap="" data-hero-headline="">
                Creating <RotatingWord />
              </span>
              <span className="hero__headline-line" data-gsap="" data-hero-headline="">
                products that drive value.
              </span>
            </h1>

            {/* 3. Supporting paragraph */}
            <p className="hero__support" data-gsap="" data-hero-role="">
              Building experiences that balance user needs and business goals
              through creative problem-solving.
            </p>

            {/* 4. Current role — "Livinginsider" is underlined and
                prepared as a future link; no routing wired up yet.
                role="button" registers it with the site's custom-cursor
                hover affordance (native `cursor` is suppressed globally
                via .has-custom-cursor, so CSS `cursor:pointer` alone
                wouldn't be visible — see Cursor.jsx's INTERACTIVE list). */}
            <p className="hero__status" data-gsap="" data-hero-role="">
              Currently designing PropTech products at{' '}
              <span className="hero__status-link" role="button">Livinginsider</span>.
            </p>

          </div>
        </div>
      </div>

      {/* 5. Scroll cue — "Featured Work" label + a single chevron.
          href="#work" + global scroll-behavior:smooth (html, see
          globals.css) already smooth-scrolls to the Work section. */}
      <a
        ref={indicatorRef}
        href="#work"
        className="hero__indicator"
        data-gsap=""
        data-hero-scroll=""
        aria-label="Scroll to Featured Work"
      >
        <span className="hero__indicator-label">Featured Work</span>
        <ChevronDownIcon
          className="hero__indicator-chevron"
          width={16} height={16}
          aria-hidden="true"
        />
      </a>
    </section>
  );
}
