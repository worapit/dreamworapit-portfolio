import { generateMeta } from '../../lib/seo';
import Link from 'next/link';
import TestimonialCarousel from '../../components/showcase/TestimonialCarousel';

export const metadata = generateMeta({
  title: 'About — w0rapit',
  description: 'Worapit Muangyot — Product Designer based in Thailand, focused on UX strategy and design systems.',
  path: '/about',
});

const TESTIMONIALS = [
  {
    quote:
      'Worapit brought clarity to our most complex user flows. The redesign reduced support tickets by 38% in the first quarter — and our NPS improvement exceeded every expectation we had going in.',
    name: 'Sarah Chen',
    role: 'Head of Product · ARIA PropTech',
    initials: 'SC',
    color: 'blue',
  },
  {
    quote:
      'Working with Worapit was exceptional. He delivered designs that were both beautiful and deeply research-grounded. Our students understood the platform immediately — zero onboarding friction.',
    name: 'Jakrapong Nimman',
    role: 'CTO · LearnPath',
    initials: 'JN',
    color: 'purple',
  },
  {
    quote:
      'The design system Worapit built became the backbone of our entire product. It scaled effortlessly to 15 engineers and cut our design-to-development handoff time in half. Extraordinary work.',
    name: 'Aroon Tansakul',
    role: 'CEO · SignOS Digital',
    initials: 'AT',
    color: 'teal',
  },
];

export default function AboutPage() {
  return (
    <main className="pg-top">
      <div className="wrap">
        <div className="about-pg">

          {/* ── Identity ── */}
          <header className="about-pg__hd">
            <p className="eyebrow" aria-hidden="true">About</p>
            <h1 className="about-pg__title">
              Designing products that are clear,<br />
              purposeful, and easy to use.
            </h1>
          </header>

          <div className="about-pg__body">

            {/* Bio */}
            <section className="about-pg__section" aria-labelledby="bio-heading">
              <h2 id="bio-heading" className="about-pg__section-label">Background</h2>
              <div className="about-pg__prose">
                <p>
                  I&rsquo;m Worapit, a Product Designer based in Thailand with experience
                  across PropTech, EdTech, SaaS, and digital media. My work sits at the
                  intersection of UX strategy, interface design, and design systems.
                </p>
                <p>
                  I care about making complex workflows feel simple — whether that means
                  rethinking navigation architecture, building component-first design
                  systems, or reducing cognitive load for multi-role platforms.
                </p>
                <p>
                  Currently open to full-time Product Designer and Senior UX/UI roles,
                  as well as freelance engagements.
                </p>
              </div>
            </section>

            {/* Skills */}
            <section className="about-pg__section" aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="about-pg__section-label">Expertise</h2>
              <ul className="about-skills">
                {[
                  'Product Strategy',
                  'UX Research',
                  'Interaction Design',
                  'Design Systems',
                  'Prototyping',
                  'Usability Testing',
                  'Information Architecture',
                  'Figma',
                ].map((skill) => (
                  <li key={skill} className="about-skill">{skill}</li>
                ))}
              </ul>
            </section>

            {/* Experience highlights */}
            <section className="about-pg__section" aria-labelledby="exp-heading">
              <h2 id="exp-heading" className="about-pg__section-label">Experience</h2>
              <div className="about-exp">
                {[
                  {
                    role: 'Product Designer',
                    company: 'Livinginsider',
                    period: '2025',
                    note: 'MyStock — property listing platform and design system',
                  },
                  {
                    role: 'Product Designer',
                    company: 'Freelance',
                    period: '2025',
                    note: 'SDQueue — real-time queue management platform',
                  },
                  {
                    role: 'UX Designer',
                    company: 'Chiang Mai University',
                    period: '2025',
                    note: 'ScoreOBE+ — academic assessment platform, 800+ users',
                  },
                ].map(({ role, company, period, note }) => (
                  <div key={company} className="about-exp__item">
                    <div className="about-exp__header">
                      <span className="about-exp__role">{role}</span>
                      <span className="about-exp__meta">{company} · {period}</span>
                    </div>
                    <p className="about-exp__note">{note}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="about-pg__section about-pg__cta-section">
              <p className="about-pg__cta-text">
                Interested in working together?
              </p>
              <div className="about-pg__cta-actions">
                <a href="mailto:hello@w0rapit.com" className="btn btn--pr">
                  Send a Message
                </a>
                <Link href="/work" className="btn btn--out">
                  View All Work
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS — outside .wrap so the carousel is full-width ── */}
      <section className="section testi" id="testimonials" aria-labelledby="testi-title">
        <div className="wrap">
          <header className="sec-hd">
            <p className="eyebrow" aria-hidden="true">Testimonials</p>
            <h2 className="sec-title" id="testi-title">What Collaborators Say</h2>
          </header>
        </div>
        <TestimonialCarousel items={TESTIMONIALS} />
      </section>

    </main>
  );
}
