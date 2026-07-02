'use client';

import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import ProjectPlaceholder from './ProjectPlaceholder';

/**
 * WorkCard — full-image card with text overlay for the /work listing page.
 * No GSAP; uses CSS transitions for hover effects.
 *
 * The image fills the entire card; title and meta sit inside a bottom
 * gradient overlay and stay visible at all times, while a corner arrow
 * fades in on hover. The whole card is a single link, so it's the full
 * hover/click target.
 *
 * Props: title, company, year, slug, workSection
 */
export default function WorkCard({ title, company, year, slug, workSection }) {
  const isCaseStudy = workSection === 'case-study';

  return (
    <article className="work-card">
      <Link
        href={`/work/${slug}`}
        className="work-card__link"
        aria-label={`View ${title} ${isCaseStudy ? 'case study' : 'project'}`}
      >
        <div className="work-card__art">
          <ProjectPlaceholder size={28} />
        </div>

        {/* Bottom gradient overlay — holds title/meta (always visible) and corner arrow (hover only) */}
        <div className="work-card__overlay">
          <div className="work-card__overlay-text">
            <h3 className="work-card__title">{title}</h3>

            {(company || year) && (
              <p className="work-card__meta">
                {company && <span>{company}</span>}
                {company && year && <span aria-hidden="true"> · </span>}
                {year    && <span>{year}</span>}
              </p>
            )}
          </div>

          <span className="work-card__arrow" aria-hidden="true">
            <ArrowUpRightIcon width={18} height={18} />
          </span>
        </div>
      </Link>
    </article>
  );
}
