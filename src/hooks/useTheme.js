'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'w-theme';
const TRANSITION_CLASS = 'theme-tx';

/**
 * Manages light / dark theme.
 * - On mount: reads localStorage → system preference → sets data-theme on <html>
 * - toggle(): switches theme, persists to localStorage, adds smooth transition class
 * - Listens for OS-level preference changes (when no stored value)
 *
 * @returns {{ theme: 'light'|'dark'; toggle: () => void; isDark: boolean }}
 */
export function useTheme() {
  const [theme, setTheme] = useState('dark');

  // Initialise from localStorage or system preference.
  // Not a useSyncExternalStore candidate: this syncs from three sources
  // (localStorage, matchMedia, and the resolved DOM attribute) and
  // `apply()` itself writes to the DOM/localStorage as a side effect —
  // useSyncExternalStore's snapshot getter must be a pure read, so it
  // can't model "resolve + apply + persist" in one step the way this
  // mount-time sync genuinely needs to.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(initial);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from external storage/matchMedia, not derivable from props/state
    setTheme(initial);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onOS = (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const next = e.matches ? 'dark' : 'light';
        apply(next);
        setTheme(next);
      }
    };
    mq.addEventListener('change', onOS);
    return () => mq.removeEventListener('change', onOS);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      apply(next);
      return next;
    });
  }, []);

  return { theme, toggle, isDark: theme === 'dark' };
}

/** Apply theme to DOM + localStorage with a smooth CSS transition. */
function apply(theme) {
  const root = document.documentElement;
  root.classList.add(TRANSITION_CLASS);
  root.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  clearTimeout(apply._t);
  apply._t = setTimeout(() => root.classList.remove(TRANSITION_CLASS), 320);
}
