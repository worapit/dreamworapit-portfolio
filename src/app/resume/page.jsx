import { generateMeta } from '../../lib/seo';
import Link from 'next/link';
import ContactSection from '../../components/narrative/ContactSection';

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
    <div className="pg-top">
      <div className="wrap wrap--sm resume-pg__content">

        {/* Header */}
        <header className="resume-pg__header">
          <p className="eyebrow">Résumé</p>
          <h1 className="resume-pg__title">
            Worapit
          </h1>
          <p className="resume-pg__role">
            UX/UI Designer &amp; Experience Storyteller
          </p>
          <div className="resume-pg__links">
            <a href="mailto:hello@w0rapit.com" className="btn btn--out btn--sm">hello@w0rapit.com</a>
            <a href="https://linkedin.com/in/worapit" className="btn btn--out btn--sm" target="_blank" rel="noopener">LinkedIn ↗</a>
            <a href="/resume.pdf" className="btn btn--pr btn--sm" download>Download PDF</a>
          </div>
        </header>

        {/* Experience */}
        <section aria-labelledby="exp-title" className="resume-pg__section">
          <h2 id="exp-title" className="resume-pg__section-title">
            Experience
          </h2>
          <div className="resume-pg__exp-list">
            {EXPERIENCE.map(({ role, company, period, description, highlights }) => (
              <article key={company} className="resume-pg__exp-item">
                <div>
                  <h3 className="resume-pg__exp-role">{role}</h3>
                  <p className="resume-pg__exp-company">{company}</p>
                  <p className="resume-pg__exp-desc">{description}</p>
                  <ul className="resume-pg__exp-highlights">
                    {highlights.map((h) => (
                      <li key={h} className="resume-pg__exp-highlight">{h}</li>
                    ))}
                  </ul>
                </div>
                <span className="resume-pg__exp-period">{period}</span>
              </article>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section aria-labelledby="skills-title">
          <h2 id="skills-title" className="resume-pg__section-title">
            Skills
          </h2>
          <div className="resume-pg__skills-grid">
            {SKILLS.map(({ category, items }) => (
              <div key={category}>
                <p className="resume-pg__skill-cat">
                  {category}
                </p>
                <div className="resume-pg__skill-tags">
                  {items.map((item) => <span key={item} className="tag tag-m">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <ContactSection variant="compact" />
    </div>
  );
}
