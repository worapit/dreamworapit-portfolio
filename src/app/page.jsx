import { generateMeta } from '../lib/seo';
import { PROJECTS } from '../lib/projects';
import Hero from '../components/identity/Hero';
import ProjectCard from '../components/showcase/ProjectCard';
import ProjectProgress from '../components/showcase/ProjectProgress';
import ContactSection from '../components/narrative/ContactSection';
import StackedReveal from '../components/layout/StackedReveal';

export const metadata = generateMeta({
  title: 'w0rapit — UX/UI Designer & Experience Storyteller',
  path: '/',
});

const HOME_PROJECTS = PROJECTS.filter((p) => p.showOnHome);

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
              <div className="work-inner">
                <div className="proj-list">
                  {HOME_PROJECTS.map((project, i) => (
                    <ProjectCard key={project.slug} {...project} featured={i === 0} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ProjectProgress projects={HOME_PROJECTS} />
        </section>

        <ContactSection />
      </StackedReveal>
    </>
  );
}
