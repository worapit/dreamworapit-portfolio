import { generateMeta } from '../../lib/seo';
import { PROJECTS } from '../../lib/projects';
import WorkCard from '../../components/showcase/WorkCard';
import WorkSectionNav from '../../components/showcase/WorkSectionNav';

export const metadata = generateMeta({
  title: 'Work — w0rapit',
  description: 'All case studies by Worapit — UX/UI Designer across PropTech, EdTech, SaaS, and more.',
  path: '/work',
});

const SECTIONS = [
  {
    id: 'product-work',
    eyebrow: 'Product Work',
    description: 'Real-world products, design systems, and client projects.',
    section: 'product',
  },
  {
    id: 'case-studies',
    eyebrow: 'Case Studies',
    description: 'Independent explorations, redesigns, and product concepts.',
    section: 'case-study',
  },
];

export default function WorkPage() {
  const navSections = SECTIONS
    .map(({ id, eyebrow, section }) => ({
      id,
      label: eyebrow,
      count: PROJECTS.filter((p) => p.workSection === section).length,
    }))
    .filter(({ count }) => count > 0);

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>

      {/* ── Tabs — lightweight, sticky only once scrolled past it ── */}
      <WorkSectionNav sections={navSections} />

      <div className="wrap">
        {/* ── Sections — Product Work, then Case Studies ── */}
        {SECTIONS.map(({ id, eyebrow, description, section }) => {
          const projects = PROJECTS.filter((p) => p.workSection === section);
          if (projects.length === 0) return null;

          return (
            <section
              key={id}
              id={id}
              className="work-section"
              aria-labelledby={`${id}-h`}
            >
              <header className="work-section__hd">
                <h2 className="work-section__title" id={`${id}-h`}>{eyebrow}</h2>
                <p className="work-section__desc">{description}</p>
              </header>

              <div className="work-grid">
                {projects.map((project) => (
                  <WorkCard key={project.slug} {...project} />
                ))}
              </div>
            </section>
          );
        })}

      </div>
    </main>
  );
}
