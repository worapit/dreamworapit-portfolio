'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import RotatingWord from './RotatingWord';
import WaterBackground from './WaterBackground';

// Fixed (not Math.random()) so server/client markup matches — hand-
// varied left%/size/duration/delay reads as organic without risking a
// hydration mismatch. Hidden on mobile via CSS. Three size tiers
// (small 8–10px, medium 14–18px, large 22–28px) so the set feels like
// real droplets of different weight, not a uniform dot grid — mostly
// small/medium with large ones used sparingly to stay minimal.
const DROPLETS = [
  { left: '5%',  size: 9,  duration: 15,   delay: 0  },  // small
  { left: '14%', size: 16, duration: 19,   delay: 4  },  // medium
  { left: '23%', size: 24, duration: 17,   delay: 2  },  // large
  { left: '33%', size: 10, duration: 21,   delay: 7  },  // small
  { left: '43%', size: 15, duration: 16,   delay: 9  },  // medium
  { left: '55%', size: 8,  duration: 20,   delay: 1  },  // small
  { left: '65%', size: 18, duration: 18,   delay: 5  },  // medium
  { left: '75%', size: 27, duration: 22,   delay: 11 },  // large
  { left: '85%', size: 14, duration: 16.5, delay: 3  },  // medium
  { left: '93%', size: 9,  duration: 19.5, delay: 8  },  // small
];

/**
 * Hero section — full-viewport intro with loader-coordinated entrance.
 * Listens for the 'w0rapit:loaded' event dispatched by PageWrapper.
 */
export default function Hero() {
  const prefersReduced = useReducedMotion();
  const indicatorRef = useRef(null);
  const dropletsRef = useRef(null);

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

  // Water-droplet mouse interaction — droplets gently push away from
  // the cursor when it passes near them. Desktop/fine-pointer only
  // (droplets are also CSS-hidden on mobile, see globals.css); the
  // ambient upward float is plain CSS on .hero__droplet itself, this
  // only ever touches the separate .hero__droplet-inner transform so
  // the two never fight over the same property.
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (!dropletsRef.current) return;

    let cancelled = false;
    let cleanup = () => {};
    import('../../styles/motion/presets').then(({ dropletRepulsion }) => {
      if (cancelled) return;
      dropletRepulsion(dropletsRef.current).then((fn) => {
        if (cancelled) { fn(); return; }
        cleanup = fn;
      });
    });
    return () => { cancelled = true; cleanup(); };
  }, [prefersReduced]);

  return (
    <section className="hero" id="home" aria-labelledby="hero-h1">
      <WaterBackground />
      {/* Atmospheric background glows + floating water droplets */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__glow-br" />
        <div className="hero__glow-tl" />
        <div ref={dropletsRef} className="hero__droplets">
          {DROPLETS.map((d, i) => (
            <span
              key={i}
              className="hero__droplet"
              style={{
                left: d.left,
                '--dd': `${d.duration}s`,
                '--ddelay': `${d.delay}s`,
                '--dsize': `${d.size}px`,
              }}
            >
              <span className="hero__droplet-inner" />
            </span>
          ))}
        </div>
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

            {/* 3. Current role — "Livinginsider" is underlined and
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
        <svg
          className="hero__indicator-chevron"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
