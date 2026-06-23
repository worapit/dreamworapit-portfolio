'use client';

import Link from 'next/link';

/**
 * WorkCard — compact 2-column grid card for the /work listing page.
 * No GSAP; uses CSS transitions for hover effects.
 *
 * One complete glass unit: image, title, and meta all live inside a
 * single bordered card and a single link, so the whole card — not just
 * the image — is the hover/click target.
 *
 * Props: title, company, year, slug, workSection
 */
export default function WorkCard({ title, company, year, slug, workSection }) {
  const isCaseStudy = workSection === 'case-study';
  const ctaLabel = isCaseStudy ? 'View Case Study →' : 'View Project →';

  return (
    <article className="work-card">
      <Link
        href={`/work/${slug}`}
        className="work-card__link"
        aria-label={`View ${title} ${isCaseStudy ? 'case study' : 'project'}`}
      >
        {/* Image area */}
        <div className="work-card__img">
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

          {/* Hover overlay — one consistent hover style for the whole card */}
          <div className="work-card__overlay" aria-hidden="true">
            <span className="work-card__overlay-cta">{ctaLabel}</span>
          </div>
        </div>

        {/* Info — title first, meta second, inside the same card */}
        <div className="work-card__info">
          <h3 className="work-card__title">{title}</h3>

          {(company || year) && (
            <p className="work-card__meta">
              {company && <span>{company}</span>}
              {company && year && <span aria-hidden="true"> · </span>}
              {year    && <span>{year}</span>}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
