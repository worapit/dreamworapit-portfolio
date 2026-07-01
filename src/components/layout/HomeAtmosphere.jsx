'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * HomeAtmosphere — fixed full-viewport backdrop for the Home page only
 * (mounted once in page.jsx, behind Hero/Work/Contact via z-index:-1).
 * CSS gradients + a tiny inline noise texture provide the "dark sky"
 * read; the cursor spotlight is the only JS/animation here.
 */
export default function HomeAtmosphere() {
  const spotRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
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
    <div className="home-atmosphere" aria-hidden="true">
      <div className="home-atmosphere__noise" />
      <div ref={spotRef} className="home-atmosphere__spotlight" />
    </div>
  );
}
