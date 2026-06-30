'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getProjectSectionId } from '../../lib/projects';
import ProjectPlaceholder from './ProjectPlaceholder';

export default function ProjectCard({
  title, editorialMeta, headline, slug, featured = false,
}) {
  const cardRef = useRef(null);
  const artRef  = useRef(null);
  const prefersReduced = useReducedMotion();

  // Scroll reveal: scale 0.98 → 1, opacity 0.9 → 1, y 32 → 0, once,
  // the first time the card scrolls into view (scaleReveal) — then a
  // continuous dip (scale 1 → 0.985, opacity slightly down) as it
  // scrolls past center and starts exiting the top (cardLeave). The
  // two never overlap: cardLeave's scrub window only starts once the
  // card is centered, well after scaleReveal's once-fired entrance has
  // already finished. See scroll.js.
  //
  // Image parallax (y -24 → 24, scale 1.03 → 1) runs on the outer art
  // layer for the card's whole transit through the viewport.
  //
  // Hover (image zoom, card lift, arrow shift, glow) is plain CSS on
  // `.proj-card:hover` — no JS/GSAP needed for a state that's just
  // "is the pointer over this element." The art's hover-zoom lives on
  // a separate inner element so it never fights GSAP's inline
  // transform on the outer parallax layer.
  useEffect(() => {
    if (prefersReduced || !cardRef.current) return;
    let cancelled = false;
    const cleanups = [];
    import('../../styles/motion/scroll').then(({ scaleReveal, cardLeave, imageParallax }) => {
      if (cancelled) return;
      scaleReveal(cardRef.current).then((fn) => { cancelled ? fn() : cleanups.push(fn); });
      cardLeave(cardRef.current).then((fn) => { cancelled ? fn() : cleanups.push(fn); });
      if (artRef.current) {
        imageParallax(artRef.current).then((fn) => { cancelled ? fn() : cleanups.push(fn); });
      }
    });
    return () => { cancelled = true; cleanups.forEach((fn) => fn()); };
  }, [prefersReduced]);

  // Proximity glow — CSS custom properties tracking pointer position
  // within the card, consumed by the radial-gradient ring in
  // .proj-card__glow (opacity itself is a plain CSS :hover transition).
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    card.addEventListener('mousemove', onMove);
    return () => card.removeEventListener('mousemove', onMove);
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
            <div className="proj-card__art-inner">
              <ProjectPlaceholder size={36} />
            </div>
          </div>

          {/* Permanent bottom shade — readability for the overlay text,
              not a hover-only effect (unlike the old below-image layout). */}
          <div className="proj-card__shade" aria-hidden="true" />

          {/* Proximity glow ring — masked to just the border stroke,
              radial-gradient centered on --mx/--my (set on mousemove
              above), visible only on hover/focus. */}
          <div className="proj-card__glow" aria-hidden="true" />

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
