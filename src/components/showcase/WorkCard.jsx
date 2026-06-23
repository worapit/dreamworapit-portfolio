'use client';

import Link from 'next/link';

/**
 * WorkCard — compact 2-column grid card for the /work listing page.
 * No GSAP; uses CSS transitions for hover effects.
 *
 * Editorial-minimal: image, meta line, title only — no description or
 * tags, so the image stays the primary focus of the card.
 *
 * Props: title, company, year, slug
 */
export default function WorkCard({ title, company, year, slug }) {
  return (
    <article className="work-card" aria-label={`${title} project`}>

      {/* Image — clickable, CSS scale on hover */}
      <Link
        href={`/work/${slug}`}
        className="work-card__img"
        aria-label={`View ${title} case study`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="work-card__art">
          {/* Placeholder — replaced with real image later */}
          <div className="proj-placeholder" aria-hidden="true">
            <svg
              width="28" height="28" viewBox="0 0 32 32" fill="none"
              aria-hidden="true"
            >
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

        {/* Hover overlay */}
        <div className="work-card__overlay" aria-hidden="true">
          <span className="work-card__overlay-cta">View Case Study →</span>
        </div>
      </Link>

      {/* Info — meta line above title, editorial style */}
      <div className="work-card__info">
        {(company || year) && (
          <p className="work-card__meta">
            {company && <span>{company}</span>}
            {company && year && <span aria-hidden="true"> · </span>}
            {year    && <span>{year}</span>}
          </p>
        )}

        <h3 className="work-card__title">
          <Link href={`/work/${slug}`}>{title}</Link>
        </h3>
      </div>
    </article>
  );
}
