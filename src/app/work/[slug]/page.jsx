import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProject, getAllSlugs } from '../../../lib/projects';
import { generateMeta } from '../../../lib/seo';
import { projectSchema } from '../../../lib/jsonld';

/** Pre-render all known project slugs at build time */
export function generateStaticParams() {
  return getAllSlugs();
}

/** Per-page metadata */
export function generateMetadata({ params }) {
  const project = getProject(params.slug);
  if (!project) return {};
  return generateMeta({
    title: `${project.title} — w0rapit`,
    description: project.shortDesc,
    path: `/work/${params.slug}`,
  });
}

export default function CaseStudyPage({ params }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const { title, category, role, year, tools, outcome, gradient,
          overview, challenge, process, result, icon, slug } = project;

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
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
      <div style={{ width: '100%', aspectRatio: '21/9', background: gradient, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.07 }} aria-hidden="true">
          <defs>
            <pattern id="cs-pat" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0L0 0 0 32" fill="none" stroke="white" strokeWidth=".5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cs-pat)"/>
        </svg>
        {icon && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: icon }} />
        )}
      </div>

      {/* Content */}
      <div className="wrap wrap--sm" style={{ paddingBlock: 'clamp(3rem,8vw,6rem)' }}>

        {/* Back link */}
        <Link href="/#work" className="btn btn-glass btn--sm" style={{ marginBottom: '2.5rem', display: 'inline-flex' }}>
          ← Back to Work
        </Link>

        {/* Title block */}
        <header style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1rem' }}>
            <span className="tag tag-a">{category}</span>
            <span className="tag tag-m">{year}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-.04em', marginBottom: '1rem', lineHeight: 1.1 }}>
            {title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.375rem', alignItems: 'center' }}>
            <span style={{ fontSize: '.875rem', color: 'var(--tx-2)', marginRight: '.5rem' }}>{role}</span>
            {(tools ?? []).map((t) => <span key={t} className="tag tag-m">{t}</span>)}
          </div>
        </header>

        {/* Outcome stat */}
        <div className="info-card" style={{ marginBottom: '3rem', maxWidth: '320px' }}>
          <span className="info-card__label">Key Outcome</span>
          <span className="info-card__value">{outcome}</span>
        </div>

        {/* Body sections */}
        {[
          { id: 'overview',  label: 'Overview',        content: overview  },
          { id: 'challenge', label: 'The Challenge',   content: challenge },
          { id: 'result',    label: 'The Result',      content: result    },
        ].map(({ id, label, content }) => (
          <section key={id} aria-labelledby={id} style={{ marginBottom: '2.5rem' }}>
            <h2 id={id} style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '.875rem' }}>{label}</h2>
            <p style={{ fontSize: '1rem', color: 'var(--tx-2)', lineHeight: 1.78 }}>{content}</p>
          </section>
        ))}

        {/* Process */}
        {process?.length > 0 && (
          <section aria-labelledby="process" style={{ marginBottom: '3rem' }}>
            <h2 id="process" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Process</h2>
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {process.map((step, i) => (
                <li key={i} style={{ fontSize: '1rem', color: 'var(--tx-2)', lineHeight: 1.7 }}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        {/* Next project */}
        <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--bd-1)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/#work" className="btn btn--out">← All Projects</Link>
          <a href="/#contact" className="btn btn--pr">Start a Project →</a>
        </div>
      </div>
    </div>
  );
}
