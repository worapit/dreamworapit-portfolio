'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getProjectSectionId } from '../../lib/projects';

/**
 * Vertical dot progress indicator for the Home page's featured-project
 * sections.
 *
 * Three independent observers, deliberately not merged into one:
 *  - `wrapperObserver` watches the whole project list (any intersection
 *    at all). This is the fallback the indicator falls back to if no
 *    single section can be confidently called "active" — it still
 *    shows, just keeps whatever activeIndex it last had.
 *  - `contactObserver` watches #contact. As soon as ANY part of Contact
 *    is visible, the indicator hides — this takes priority over the
 *    wrapper observer, because the project list's tail end and Contact
 *    can both be on screen at once near the bottom of the page (Contact
 *    + Footer are shorter than a typical viewport), and the indicator
 *    must never show while Contact is present.
 *  - `activeObserver` watches each section with a narrow rootMargin (the
 *    middle 40% of the viewport) so "active" means "currently centered",
 *    not just "barely on screen".
 *
 * Final visible state = wrapper is intersecting AND Contact is not.
 */
export default function ProjectProgress({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wrapperVisible, setWrapperVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const activeIndexRef = useRef(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const sections = projects
      .map((p) => document.getElementById(getProjectSectionId(p.slug)))
      .filter(Boolean);
    if (!sections.length) return;

    const wrapper = sections[0].closest('.proj-list') || sections[0].parentElement;
    const contact = document.getElementById('contact');

    const wrapperObserver = new IntersectionObserver(
      ([entry]) => setWrapperVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (wrapper) wrapperObserver.observe(wrapper);

    const contactObserver = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (contact) contactObserver.observe(contact);

    const ratios = new Map();
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let bestIndex = -1;
      let bestRatio = 0;
      sections.forEach((el, i) => {
        const ratio = ratios.get(el) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestIndex = i;
        }
      });

      // Fallback: if nothing currently clears the threshold, keep the
      // last known active dot rather than snapping back to the first.
      if (bestIndex !== -1) {
        activeIndexRef.current = bestIndex;
        setActiveIndex(bestIndex);
      }
    }, { threshold: 0.35, rootMargin: '-30% 0px -30% 0px' });

    sections.forEach((el) => activeObserver.observe(el));

    return () => {
      wrapperObserver.disconnect();
      contactObserver.disconnect();
      activeObserver.disconnect();
    };
  }, [projects]);

  const visible = wrapperVisible && !contactVisible;

  const handleClick = (slug) => {
    const el = document.getElementById(getProjectSectionId(slug));
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
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
        >
          <span className="proj-progress__ring" aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
