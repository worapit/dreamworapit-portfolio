import { generateMeta } from '../../lib/seo';
import Link from 'next/link';

export const metadata = generateMeta({
  title: 'Résumé — Worapit · UX/UI Designer',
  description:
    'Résumé of Worapit — UX/UI Designer with 5+ years crafting digital products across PropTech, Education, and Digital Signage.',
  path: '/resume',
});

const EXPERIENCE = [
  {
    role: 'Senior UX/UI Designer',
    company: 'ARIA PropTech',
    period: '2023 – Present',
    description:
      'Led end-to-end redesign of the property search platform serving 2M+ monthly users. Established the product design process and mentored 2 junior designers.',
    highlights: ['42% reduction in search-to-contact time', 'Design system adopted across 4 product lines'],
  },
  {
    role: 'Product Designer',
    company: 'LearnPath',
    period: '2022 – 2023',
    description:
      'Owned the LMS redesign from research through delivery. Partnered with engineering on component library and design token system.',
    highlights: ['31% increase in course completion rates', '89% growth in mobile sessions'],
  },
  {
    role: 'UX/UI Designer',
    company: 'SignOS Digital',
    period: '2021 – 2022',
    description:
      'Built the design system and CMS dashboard from scratch. Collaborated daily with engineers in Storybook to ensure pixel-perfect implementation.',
    highlights: ['50% reduction in design-to-dev handoff time', '10,000+ displays managed via the new CMS'],
  },
];

const SKILLS = [
  { category: 'Design',    items: ['UX Research', 'Information Architecture', 'Interaction Design', 'Visual Design', 'Design Systems', 'Prototyping'] },
  { category: 'Tools',     items: ['Figma', 'ProtoPie', 'Maze', 'Miro', 'Storybook', 'Zeroheight'] },
  { category: 'Technical', items: ['HTML/CSS', 'Basic React', 'Design Tokens', 'GSAP', 'AI Workflow Tools'] },
  { category: 'Methods',   items: ['User Interviews', 'Usability Testing', 'A/B Testing', 'Jobs-to-be-Done', 'Agile / Scrum'] },
];

export default function ResumePage() {
  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="wrap wrap--sm" style={{ paddingBlock: 'clamp(3rem, 8vw, 6rem)' }}>

        {/* Header */}
        <header style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--bd-2)' }}>
          <p className="eyebrow">Résumé</p>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-.04em', marginBottom: '.75rem' }}>
            Worapit
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--tx-2)', marginBottom: '1.5rem' }}>
            UX/UI Designer &amp; Experience Storyteller
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.625rem' }}>
            <a href="mailto:hello@w0rapit.com" className="btn btn--out btn--sm">hello@w0rapit.com</a>
            <a href="https://linkedin.com/in/worapit" className="btn btn--out btn--sm" target="_blank" rel="noopener">LinkedIn ↗</a>
            <a href="/resume.pdf" className="btn btn--pr btn--sm" download>Download PDF</a>
          </div>
        </header>

        {/* Experience */}
        <section aria-labelledby="exp-title" style={{ marginBottom: '3rem' }}>
          <h2 id="exp-title" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--tx-1)' }}>
            Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {EXPERIENCE.map(({ role, company, period, description, highlights }) => (
              <article key={company} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tx-1)', marginBottom: '.25rem' }}>{role}</h3>
                  <p style={{ fontSize: '.875rem', color: 'var(--c-accent)', fontWeight: 600, marginBottom: '.75rem' }}>{company}</p>
                  <p style={{ fontSize: '.875rem', color: 'var(--tx-2)', marginBottom: '.75rem', lineHeight: 1.7 }}>{description}</p>
                  <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                    {highlights.map((h) => (
                      <li key={h} style={{ fontSize: '.8125rem', color: 'var(--tx-3)' }}>{h}</li>
                    ))}
                  </ul>
                </div>
                <span style={{ fontSize: '.75rem', color: 'var(--tx-3)', fontWeight: 500, whiteSpace: 'nowrap' }}>{period}</span>
              </article>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section aria-labelledby="skills-title">
          <h2 id="skills-title" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Skills
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1.5rem' }}>
            {SKILLS.map(({ category, items }) => (
              <div key={category}>
                <p style={{ fontSize: '.625rem', fontWeight: 700, letterSpacing: '.10em', textTransform: 'uppercase', color: 'var(--tx-3)', marginBottom: '.625rem' }}>
                  {category}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.375rem' }}>
                  {items.map((item) => <span key={item} className="tag tag-m">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
