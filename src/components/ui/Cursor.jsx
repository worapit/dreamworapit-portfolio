'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Custom cursor — small filled dot, desktop / fine-pointer only.
 * Hides the native cursor via `.has-custom-cursor` on <html>.
 * Outer element (JS) only ever sets position (lerped for a smooth
 * trailing follow); the inner dot's scale/ring on hover is plain CSS
 * on `.is-hover`, so the two never fight over `transform`.
 */
export default function Cursor() {
  const cursorRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Purely decorative — a shape continuously chasing the pointer is
    // exactly the kind of motion prefers-reduced-motion exists to opt
    // out of, and the native cursor already does this job functionally.
    if (prefersReduced) return;
    // Only activate on devices with a precise pointer (mouse/trackpad) —
    // touch/mobile keeps the native cursor (there isn't one to chase).
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.documentElement.classList.add('has-custom-cursor');
    cursor.style.opacity = '1';

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
      // ponytail: fixed 0.25 lerp factor, not frame-rate independent —
      // fine at typical 60–120Hz, revisit with a delta-time factor if
      // it ever feels off on very low refresh-rate displays.
      x += (targetX - x) * 0.25;
      y += (targetY - y) * 0.25;
      cursor.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(render);
    };

    // Delegate hover detection — ring/scale on any interactive element
    const INTERACTIVE = 'a, button, [role="button"], label, input, textarea, select';
    const onOver = (e) => {
      if (e.target.closest(INTERACTIVE)) {
        cursor.classList.add('is-hover');
      } else {
        cursor.classList.remove('is-hover');
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span className="custom-cursor__dot" />
    </div>
  );
}
