'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ProjectCard({
  title, editorialMeta, headline, slug, featured = false,
}) {
  const cardRef    = useRef(null);
  const wrapperRef = useRef(null);
  const artRef     = useRef(null);
  const prefersReduced = useReducedMotion();

  // Scroll reveal: fade + rise
  useEffect(() => {
    if (prefersReduced || !cardRef.current) return;
    let cancelled = false;
    let cleanup = () => {};
    import('../../styles/motion/scroll').then(({ fadeUp }) => {
      if (cancelled) return;
      fadeUp(cardRef.current, { y: 32, duration: 0.65 }).then((fn) => {
        if (cancelled) { fn(); return; }
        cleanup = fn;
      });
    });
    return () => { cancelled = true; cleanup(); };
  }, [prefersReduced]);

  // Image zoom on hover — desktop only via GSAP
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    if (window.innerWidth < 768) return;
    let cancelled = false;
    let cleanup = () => {};
    import('../../styles/motion/presets').then(({ hoverZoom }) => {
      if (cancelled) return;
      hoverZoom(wrapperRef.current, artRef.current).then((fn) => {
        if (cancelled) { fn(); return; }
        cleanup = fn;
      });
    });
    return () => { cancelled = true; cleanup(); };
  }, [prefersReduced]);

  const cardClass = ['proj-card', featured && 'proj-card--featured']
    .filter(Boolean).join(' ');

  return (
    <article ref={cardRef} className={cardClass} aria-label={`${title} project`}>

      {/* ── Hero image — full-width, links to case study ── */}
      <div ref={wrapperRef} className="proj-card__img">
        <Link
          href={`/work/${slug}`}
          className="proj-card__img-link"
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

          {/* Hover overlay — project name + CTA slides up on hover */}
          <div className="proj-overlay" aria-hidden="true">
            <div className="proj-overlay__content">
              <span className="proj-overlay__name">{title}</span>
              <span className="proj-overlay__cta">View Case Study →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Info — not clickable, purely editorial ── */}
      <div className="proj-card__info">
        {editorialMeta && (
          <p className="proj-meta-line">{editorialMeta}</p>
        )}
        <h3 className="proj-headline">{headline || title}</h3>
      </div>

    </article>
  );
}
