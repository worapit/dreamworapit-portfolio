'use client';
import { useState, useEffect } from 'react';

/**
 * Returns true when the user has requested reduced motion.
 * Reactive — updates when the OS preference changes.
 *
 * @returns {boolean}
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const onChange = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
}
