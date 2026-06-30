'use client';

import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Fixed (not Math.random()) so server/client markup matches — hand-
// varied left%/size/duration/delay is enough to read as organic
// without risking a hydration mismatch. Hidden on mobile via CSS.
const PARTICLES = [
  { left: '8%',  size: 3, duration: 16, delay: 0 },
  { left: '18%', size: 2, duration: 20, delay: 3 },
  { left: '30%', size: 4, duration: 18, delay: 6 },
  { left: '46%', size: 2, duration: 22, delay: 1 },
  { left: '58%', size: 3, duration: 17, delay: 8 },
  { left: '70%', size: 2, duration: 21, delay: 4 },
  { left: '82%', size: 4, duration: 19, delay: 10 },
  { left: '92%', size: 3, duration: 23, delay: 5 },
];

/**
 * HomeAtmosphere — fixed full-viewport backdrop for the Home page only
 * (mounted once in page.jsx, behind Hero/Work/Contact via z-index:-1).
 * CSS gradients + a tiny inline noise texture provide the "dark sky"
 * read; cursor spotlight and the floating-particle drift are the only
 * JS/animation here.
 */
export default function HomeAtmosphere() {
  const spotRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const [started, setStarted] = useState(false);

  // Particles start only once the loader's logo animation has actually
  // finished — never compete with it, and never run invisibly stacked
  // up behind the opaque loader overlay for no reason.
  useEffect(() => {
    const onLoaded = () => setStarted(true);
    if (window.__w0rapitLoaded) {
      const id = window.requestAnimationFrame(onLoaded);
      return () => window.cancelAnimationFrame(id);
    }
    window.addEventListener('w0rapit:loaded', onLoaded, { once: true });
    return () => window.removeEventListener('w0rapit:loaded', onLoaded);
  }, []);

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    // Touch/coarse pointers have no cursor to chase — skip entirely.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const spot = spotRef.current;
    if (!spot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let rafId;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const render = () => {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      spot.style.transform = `translate(${x}px, ${y}px)`;
      rafId = requestAnimationFrame(render);
    };

    spot.style.opacity = '1';
    document.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  return (
    <div className={`home-atmosphere ${started ? 'is-active' : ''}`} aria-hidden="true">
      <div className="home-atmosphere__noise" />
      <div ref={spotRef} className="home-atmosphere__spotlight" />
      {!prefersReduced && (
        <div className="home-atmosphere__particles">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="home-atmosphere__particle"
              style={{
                left: p.left,
                '--ps': `${p.size}px`,
                '--pd': `${p.duration}s`,
                '--pdelay': `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
