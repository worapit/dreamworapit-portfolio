import { generateMeta } from '../../lib/seo';
import Link from 'next/link';

export const metadata = generateMeta({
  title: 'Create — w0rapit',
  description: 'Personal experiments, visual explorations, and creative projects by Worapit.',
  path: '/create',
});

export default function CreatePage() {
  return (
    <main className="pg-top">
      <div className="wrap">
        <div className="create-pg">

          <header className="create-pg__hd">
            <p className="eyebrow" aria-hidden="true">Create</p>
            <h1 className="create-pg__title">
              Personal experiments and creative explorations.
            </h1>
            <p className="create-pg__sub">
              Side projects, visual design, motion, and anything built purely out of curiosity.
              This space is updated regularly.
            </p>
          </header>

          {/* Placeholder grid — filled as work is added */}
          <div className="create-grid">
            {[
              {
                label: 'Visual Design',
                desc: 'Editorial layouts, typography experiments, and visual identity explorations.',
                soon: true,
              },
              {
                label: 'Motion & Interaction',
                desc: 'Micro-interactions, animation concepts, and interface motion studies.',
                soon: true,
              },
              {
                label: 'Design Systems',
                desc: 'Personal component libraries, token systems, and pattern explorations.',
                soon: true,
              },
              {
                label: 'Open Source',
                desc: 'Tools, templates, and resources built for the design community.',
                soon: true,
              },
            ].map(({ label, desc, soon }) => (
              <div key={label} className="create-card">
                <div className="create-card__badge">
                  {soon && <span className="create-card__soon">Coming Soon</span>}
                </div>
                <h3 className="create-card__title">{label}</h3>
                <p className="create-card__desc">{desc}</p>
              </div>
            ))}
          </div>

          <div className="create-pg__footer">
            <p className="create-pg__footer-text">
              In the meantime, explore the product case studies.
            </p>
            <Link href="/work" className="btn btn--out">
              View Case Studies
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
