'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// SSR/first-paint default — matches the previous useState(false) initial
// value exactly, so hydration never mismatches the server-rendered markup.
function getServerSnapshot() {
  return false;
}

/**
 * Returns true when the user has requested reduced motion.
 * Reactive — updates when the OS preference changes.
 *
 * @returns {boolean}
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
