'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getProjectSectionId } from '../../lib/projects';
import ProjectPlaceholder from './ProjectPlaceholder';

export default function ProjectCard({
  title, editorialMeta, headline, slug, featured = false,
}) {
  const cardRef   = useRef(null);
  const artRef    = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || !cardRef.current) return;
    let cancelled = false;
    const cleanups = [];

    import('../../styles/motion/scroll').then(({ cardScrub, fadeUp }) => {
      if (cancelled) return;
      if (window.matchMedia('(max-width: 767px)').matches) {
        fadeUp(cardRef.current, { y: 20, duration: 0.5 }).then(
          (fn) => { cancelled ? fn() : cleanups.push(fn); },
        );
      } else {
        cardScrub(cardRef.current, artRef.current).then(
          (fn) => { cancelled ? fn() : cleanups.push(fn); },
        );
      }
    });

    return () => { cancelled = true; cleanups.forEach((fn) => fn()); };
  }, [prefersReduced]);

  // Proximity glow
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
              <ArrowUpRightIcon width={18} height={18} />
            </span>
          </div>
        </Link>
      </article>
    </section>
  );
}
