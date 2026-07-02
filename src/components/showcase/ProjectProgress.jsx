'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getProjectSectionId } from '../../lib/projects';

/**
 * Vertical dot progress indicator for the Home page's featured-project
 * sections. Native scroll is the source of truth — nothing here intercepts
 * wheel/touch input, calls preventDefault, or calls window.scrollTo.
 * The active dot follows whichever section is most visible, tracked
 * by IntersectionObserver.
 */
export default function ProjectProgress({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wrapperVisible, setWrapperVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const wrapperVisibleRef = useRef(false);
  const contactVisibleRef = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const sections = projects
      .map((p) => document.getElementById(getProjectSectionId(p.slug)))
      .filter(Boolean);
    if (!sections.length) return;

    const wrapper = sections[0].closest('.proj-list') || sections[0].parentElement;
    const contact = document.getElementById('contact');

    const wrapperObserver = new IntersectionObserver(([entry]) => {
      wrapperVisibleRef.current = entry.isIntersecting;
      setWrapperVisible(entry.isIntersecting);
    }, { threshold: 0 });
    if (wrapper) wrapperObserver.observe(wrapper);

    const contactObserver = new IntersectionObserver(([entry]) => {
      contactVisibleRef.current = entry.isIntersecting;
      setContactVisible(entry.isIntersecting);
    }, { threshold: 0 });
    if (contact) contactObserver.observe(contact);

    // Active dot follows whichever section currently has the highest
    // intersection ratio within the viewport's middle 40% — "most
    // visible," not tied to any artificial transition.
    const ratios = new Map();
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      let bestIndex = -1;
      let bestRatio = 0;
      sections.forEach((el, i) => {
        const ratio = ratios.get(el) || 0;
        if (ratio > bestRatio) { bestRatio = ratio; bestIndex = i; }
      });
      if (bestIndex !== -1) setActiveIndex(bestIndex);
    }, { threshold: 0.35, rootMargin: '-30% 0px -30% 0px' });
    sections.forEach((el) => activeObserver.observe(el));

    return () => {
      wrapperObserver.disconnect();
      contactObserver.disconnect();
      activeObserver.disconnect();
    };
  }, [projects, prefersReduced]);

  const visible = wrapperVisible && !contactVisible;

  const handleClick = (slug) => {
    const el = document.getElementById(getProjectSectionId(slug));
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <nav
      className={`proj-progress ${visible ? 'is-visible' : ''}`}
      aria-label="Featured projects progress"
    >
      {projects.map(({ slug, title }, i) => (
        <button
          key={slug}
          type="button"
          className={`proj-progress__dot ${i === activeIndex ? 'is-active' : ''}`}
          aria-label={`Go to ${title} project`}
          aria-current={i === activeIndex ? 'true' : undefined}
          onClick={() => handleClick(slug)}
        />
      ))}
    </nav>
  );
}
