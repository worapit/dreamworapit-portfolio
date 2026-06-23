import { generateMeta } from '../lib/seo';
import { PROJECTS } from '../lib/projects';
import Hero from '../components/identity/Hero';
import ProjectCard from '../components/showcase/ProjectCard';
import ContactSection from '../components/narrative/ContactSection';
import StackedReveal from '../components/layout/StackedReveal';

export const metadata = generateMeta({
  title: 'w0rapit — UX/UI Designer & Experience Storyteller',
  path: '/',
});


export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <Hero />

      {/* ── WORK → CONTACT (layered reveal) ── */}
      <StackedReveal>
        <section className="section work" id="work" aria-label="Selected Work">
          <div className="wrap">
            <div className="g12">
              <div className="proj-list">
                {PROJECTS
                  .filter((p) => p.showOnHome)
                  .map((project, i) => (
                    <ProjectCard key={project.slug} {...project} featured={i === 0} />
                  ))}
              </div>
            </div>
          </div>
        </section>

        <ContactSection />
      </StackedReveal>
    </>
  );
}
