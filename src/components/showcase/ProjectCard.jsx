'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getProjectSectionId } from '../../lib/projects';
import { BREAKPOINT_MD } from '../../lib/breakpoints';
import ProjectPlaceholder from './ProjectPlaceholder';

export default function ProjectCard({
  title, editorialMeta, headline, slug, featured = false,
}) {
  const cardRef = useRef(null);
  const artRef  = useRef(null);
  const prefersReduced = useReducedMotion();

  // Scroll reveal: scale 0.985 → 1, opacity 0.9 → 1, y 24 → 0, once,
  // the first time the card scrolls into view. Independent of scroll
  // position/snap state otherwise — it doesn't care how the card got
  // into view (native scroll, scroll-snap settling, or a dot click),
  // it only ever fires the one time. See scaleReveal in scroll.js.
  useEffect(() => {
    if (prefersReduced || !cardRef.current) return;
    let cancelled = false;
    let cleanup = () => {};
    import('../../styles/motion/scroll').then(({ scaleReveal }) => {
      if (cancelled) return;
      scaleReveal(cardRef.current).then((fn) => {
        if (cancelled) { fn(); return; }
        cleanup = fn;
      });
    });
    return () => { cancelled = true; cleanup(); };
  }, [prefersReduced]);

  // Image zoom on hover — desktop only via GSAP. Listens on the whole
  // card (not just the image) so it stays in sync with the CSS hover
  // effects on the overlay text/arrow, which all key off `.proj-card:hover`.
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    if (window.innerWidth < BREAKPOINT_MD) return;
    let cancelled = false;
    let cleanup = () => {};
    import('../../styles/motion/presets').then(({ hoverZoom }) => {
      if (cancelled) return;
      hoverZoom(cardRef.current, artRef.current).then((fn) => {
        if (cancelled) { fn(); return; }
        cleanup = fn;
      });
    });
    return () => { cancelled = true; cleanup(); };
  }, [prefersReduced]);

  const cardClass = ['proj-card', featured && 'proj-card--featured']
    .filter(Boolean).join(' ');

  return (
    <section id={getProjectSectionId(slug)} className="proj-section" aria-label={`${title} project`}>
      <article ref={cardRef} className={cardClass}>
        <Link
          href={`/work/${slug}`}
          className="proj-card__link"
          aria-label={`View ${title} case study`}
        >
          <div ref={artRef} className="proj-card__art">
            <ProjectPlaceholder size={36} />
          </div>

          {/* Permanent bottom shade — readability for the overlay text,
              not a hover-only effect (unlike the old below-image layout). */}
          <div className="proj-card__shade" aria-hidden="true" />

          {/* Overlay content — title/meta + description bottom-left,
              arrow bottom-right. Text is always visible; only the arrow
              eases from subtle to full on hover. */}
          <div className="proj-card__content">
            <div className="proj-card__text">
              <p className="proj-card__meta">{editorialMeta || title}</p>
              {headline && <p className="proj-card__desc">{headline}.</p>}
            </div>
            <span className="proj-card__arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </Link>
      </article>
    </section>
  );
}
