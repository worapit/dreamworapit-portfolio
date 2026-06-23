import { generateMeta } from '../../lib/seo';
import { PROJECTS } from '../../lib/projects';
import WorkCard from '../../components/showcase/WorkCard';

export const metadata = generateMeta({
  title: 'Work — w0rapit',
  description: 'All case studies by Worapit — UX/UI Designer across PropTech, EdTech, SaaS, and more.',
  path: '/work',
});

const SECTIONS = [
  {
    id: 'product-work',
    eyebrow: 'Product Work',
    description: 'Product design work, design systems, and client projects.',
    section: 'product',
  },
  {
    id: 'case-studies',
    eyebrow: 'Case Studies',
    description: 'Independent explorations, research, and redesign projects.',
    section: 'case-study',
  },
];

export default function WorkPage() {
  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="wrap">

        {/* ── Page header ── */}
        <header className="work-pg__hd">
          <p className="eyebrow" aria-hidden="true">All Projects</p>
          <h1 className="work-pg__title">Selected Work</h1>
          <p className="work-pg__sub">
            {PROJECTS.length} case studies across product design, UX research, and design systems.
          </p>
        </header>

        {/* ── Sections — Product Work, then Case Studies ── */}
        {SECTIONS.map(({ id, eyebrow, description, section }, i) => {
          const projects = PROJECTS.filter((p) => p.workSection === section);
          if (projects.length === 0) return null;

          return (
            <section
              key={id}
              id={id}
              className="work-section"
              aria-labelledby={`${id}-h`}
              style={i > 0 ? { marginTop: 'clamp(5rem,9vw,8rem)' } : undefined}
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
