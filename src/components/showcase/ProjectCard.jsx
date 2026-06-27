'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getProjectSectionId } from '../../lib/projects';

export default function ProjectCard({
  title, editorialMeta, headline, slug, featured = false,
}) {
  const cardRef = useRef(null);
  const artRef  = useRef(null);
  const prefersReduced = useReducedMotion();

  // Scroll reveal: scale 0.92 → 1 + fade in, once, as the section enters
  // the viewport — restrained on purpose (see scaleReveal in scroll.js).
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
    if (window.innerWidth < 768) return;
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
            <div className="proj-placeholder" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="2" y="5" width="28" height="22" rx="3"
                  stroke="currentColor" strokeWidth="1.4" />
                <circle cx="10" cy="13" r="2.5"
                  stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M2 22l7-6 5 5 4.5-6L28 22"
                  stroke="currentColor" strokeWidth="1.4"
                  strokeLinejoin="round" strokeLinecap="round"
                />
              </svg>
              <span className="proj-placeholder__label">Project Screenshot</span>
            </div>
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
