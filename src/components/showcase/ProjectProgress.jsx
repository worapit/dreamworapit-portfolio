'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getProjectSectionId } from '../../lib/projects';
import { BREAKPOINT_MD } from '../../lib/breakpoints';

const SETTLE_DELAY = 150;    // ms of scroll inactivity before settling
const SETTLE_TOLERANCE = 4;  // px — already this close to centered, don't bother

/**
 * Vertical dot progress indicator for the Home page's featured-project
 * sections, plus a soft scroll-settle helper for the same area.
 *
 * Native scroll is the source of truth — nothing here ever intercepts
 * wheel/touch input or calls preventDefault. Two independent pieces:
 *
 *  - Dot tracking: three plain IntersectionObservers (wrapper, contact,
 *    per-section ratio) — identical in spirit to how this worked before
 *    any GSAP scroll controller existed. The active dot just follows
 *    whichever section is most visible.
 *  - Soft settle: a passive `scroll` listener that does nothing while
 *    the user is actively scrolling. Only once scroll has been still
 *    for ~150ms does it check whether the nearest project section is
 *    already close to centered (CSS scroll-snap usually gets it there)
 *    and, only if it's meaningfully off, nudges it once with a native
 *    smooth scroll. Desktop/tablet + motion-allowed only.
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

    // Soft settle — passive only. Never runs while scrolling is still
    // happening (the debounce resets on every scroll tick), never
    // intercepts the wheel, never calls preventDefault.
    let settleTimer = null;
    const useSettle = !prefersReduced && window.innerWidth >= BREAKPOINT_MD;
    const onScroll = () => {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        if (!wrapperVisibleRef.current || contactVisibleRef.current) return;

        const viewportCenter = window.innerHeight / 2;
        let best = null;
        sections.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - viewportCenter);
          if (!best || dist < best.dist) best = { dist, center };
        });
        if (!best || best.dist < SETTLE_TOLERANCE) return;

        window.scrollTo({
          top: window.scrollY + (best.center - viewportCenter),
          behavior: 'smooth',
        });
      }, SETTLE_DELAY);
    };
    if (useSettle) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      wrapperObserver.disconnect();
      contactObserver.disconnect();
      activeObserver.disconnect();
      if (settleTimer) clearTimeout(settleTimer);
      if (useSettle) window.removeEventListener('scroll', onScroll);
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
        >
          <span className="proj-progress__ring" aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
