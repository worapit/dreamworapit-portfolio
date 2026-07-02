'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'w-theme';
const TRANSITION_CLASS = 'theme-tx';

/**
 * Manages light / dark theme.
 * - On mount: reads localStorage, defaulting to light (not system
 *   preference) when nothing is stored yet — sets data-theme on <html>
 * - toggle(): switches theme, persists to localStorage, adds smooth transition class
 *
 * @returns {{ theme: 'light'|'dark'; toggle: () => void; isDark: boolean }}
 */
export function useTheme() {
  const [theme, setTheme] = useState('light');

  // Initialise from localStorage, defaulting to light on first visit —
  // matches the anti-flash script in layout.jsx, which must resolve the
  // same default before this ever runs.
  // Not a useSyncExternalStore candidate: this syncs from localStorage
  // and the resolved DOM attribute, and `apply()` itself writes to the
  // DOM/localStorage as a side effect — useSyncExternalStore's snapshot
  // getter must be a pure read, so it can't model "resolve + apply +
  // persist" in one step the way this mount-time sync genuinely needs to.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored || 'light';
    apply(initial);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from external storage, not derivable from props/state
    setTheme(initial);
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
