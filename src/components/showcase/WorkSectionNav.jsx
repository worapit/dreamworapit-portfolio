'use client';

import { useActiveSectionTracking } from '../../hooks/useActiveSectionTracking';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * WorkSectionNav — sticky in-page nav for jumping between the Work
 * page's project sections ("Product Work", "Case Studies").
 *
 * Sticks just below the global nav, tracks the active section via
 * IntersectionObserver, and smooth-scrolls to a section on click while
 * compensating for the height of both sticky bars.
 *
 * @param {{ id: string, label: string, count: number }[]} sections
 */
export default function WorkSectionNav({ sections }) {
  const sectionIds = sections.map((s) => s.id);
  // Extra rootMargin accounts for this nav's own sticky height sitting
  // below the global nav, so a section counts as "active" only once
  // its heading has actually cleared both sticky bars.
  const active = useActiveSectionTracking(sectionIds, {
    threshold: 0,
    rootMargin: '-110px 0px -55% 0px',
  }) ?? sectionIds[0];

  const prefersReduced = useReducedMotion();

  const handleClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const mainNavH = document.querySelector('.nav')?.offsetHeight ?? 0;
    const sectionNavH = document.querySelector('.work-section-nav')?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY
      - mainNavH - sectionNavH - 16;

    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <nav className="work-section-nav" aria-label="Jump to a project section">
      <div className="wrap">
        <ul className="work-section-nav__list">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`work-section-nav__link${active === id ? ' work-section-nav__link--active' : ''}`}
                aria-current={active === id ? 'true' : undefined}
                onClick={(e) => handleClick(e, id)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
