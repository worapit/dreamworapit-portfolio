'use client';

import { useRef, useEffect } from 'react';

/**
 * Custom circular cursor — desktop / fine-pointer only.
 * Hides the native cursor via `.has-custom-cursor` on <html>.
 * Scales up when hovering links, buttons, and project images.
 */
export default function Cursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Only activate on devices with a precise pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.documentElement.classList.add('has-custom-cursor');
    cursor.style.opacity = '1';

    let x = -100;
    let y = -100;
    let rafId;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
    };

    const render = () => {
      cursor.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(render);
    };

    // Delegate hover detection — scale up on any interactive element
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
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}
