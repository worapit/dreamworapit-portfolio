'use client';
import { useState, useEffect } from 'react';

/**
 * Tracks which section is currently visible in the viewport.
 * Uses IntersectionObserver — no scroll listener overhead.
 *
 * @param {string[]} sectionIds   — ordered list of section id strings
 * @param {IntersectionObserverInit} [opts]
 * @returns {string | null}  the id of the currently active section
 *
 * Usage:
 *   const active = useActiveSectionTracking(['home','work','testimonials','contact']);
 */
export function useActiveSectionTracking(sectionIds, opts = {}) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const options = {
      threshold: 0.35,
      rootMargin: '-64px 0px 0px 0px',
      ...opts,
    };

    const observer = new IntersectionObserver((entries) => {
      // Pick the entry with the highest intersection ratio
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) setActiveId(visible[0].target.id);
    }, options);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(',')]);

  return activeId;
}
