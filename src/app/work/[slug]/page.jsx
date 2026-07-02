import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProject, getAllSlugs } from '../../../lib/projects';
import { generateMeta } from '../../../lib/seo';
import { projectSchema } from '../../../lib/jsonld';
import ContactSection from '../../../components/narrative/ContactSection';

/** Pre-render all known project slugs at build time */
export function generateStaticParams() {
  return getAllSlugs();
}

/** Per-page metadata */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return generateMeta({
    title: `${project.title} — w0rapit`,
    description: project.shortDesc,
    path: `/work/${slug}`,
  });
}

export default async function CaseStudyPage({ params }) {
  const { slug: paramSlug } = await params;
  const project = getProject(paramSlug);
  if (!project) notFound();

  const { title, category, role, year, tools, outcome, gradient,
          overview, challenge, process, result, icon, slug } = project;

  return (
    <div className="pg-top">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema({
            name: title,
            description: overview,
            url: `https://w0rapit.com/work/${slug}`,
            datePublished: `${year}-01-01`,
          })),
        }}
      />

      {/* Hero image */}
      <div className="case-study__hero" style={{ background: gradient }}>
        <svg width="100%" height="100%" className="case-study__hero-pattern" aria-hidden="true">
          <defs>
            <pattern id="cs-pat" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0L0 0 0 32" fill="none" stroke="white" strokeWidth=".5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cs-pat)"/>
        </svg>
        {icon && (
          <div className="case-study__hero-icon"
            dangerouslySetInnerHTML={{ __html: icon }} />
        )}
      </div>

      {/* Content */}
      <div className="wrap wrap--sm case-study__content">

        {/* Back link */}
        <Link href="/#work" className="btn btn-glass btn--sm case-study__back">
          ← Back to Work
        </Link>

        {/* Title block */}
        <header className="case-study__header">
          <div className="case-study__tags">
            <span className="tag tag-a">{category}</span>
            <span className="tag tag-m">{year}</span>
          </div>
          <h1 className="case-study__title">
            {title}
          </h1>
          <div className="case-study__meta-row">
            <span className="case-study__role">{role}</span>
            {(tools ?? []).map((t) => <span key={t} className="tag tag-m">{t}</span>)}
          </div>
        </header>

        {/* Outcome stat */}
        <div className="info-card case-study__outcome">
          <span className="info-card__label">Key Outcome</span>
          <span className="info-card__value">{outcome}</span>
        </div>

        {/* Body sections */}
        {[
          { id: 'overview',  label: 'Overview',        content: overview  },
          { id: 'challenge', label: 'The Challenge',   content: challenge },
          { id: 'result',    label: 'The Result',      content: result    },
        ].map(({ id, label, content }) => (
          <section key={id} aria-labelledby={id} className="case-study__section">
            <h2 id={id} className="case-study__section-title">{label}</h2>
            <p className="case-study__section-body">{content}</p>
          </section>
        ))}

        {/* Process */}
        {process?.length > 0 && (
          <section aria-labelledby="process" className="case-study__process">
            <h2 id="process" className="case-study__process-title">Process</h2>
            <ol className="case-study__process-list">
              {process.map((step, i) => (
                <li key={i} className="case-study__process-item">{step}</li>
              ))}
            </ol>
          </section>
        )}

        {/* Next project */}
        <div className="case-study__next">
          <Link href="/#work" className="btn btn--out">← All Projects</Link>
          <Link href="/#contact" className="btn btn--pr">Start a Project →</Link>
        </div>
      </div>

      <ContactSection variant="compact" />
    </div>
  );
}
