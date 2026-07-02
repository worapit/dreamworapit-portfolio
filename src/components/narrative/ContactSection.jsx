'use client';

import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import WaterBackground from '../identity/WaterBackground';
import ContactModal from './ContactModal';

/**
 * @param {{ variant?: 'home' | 'compact' }} props
 * - 'home': full 100vh treatment with the water background — used once,
 *   on the home page's Work→Contact stack.
 * - 'compact': hugs its content (small py, no water canvas, no vh) —
 *   used on every other page so they all share one contact block
 *   instead of each re-implementing their own CTA.
 */
export default function ContactSection({ variant = 'home' }) {
  const isCompact     = variant === 'compact';
  const sectionRef    = useRef(null);
  const headlineRef   = useRef(null);
  const availRef      = useRef(null);
  const waterWrapRef  = useRef(null);
  const prefersReduced = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;

    let trigEnter = null;
    let trigExit  = null;
    let cancelled = false;

    (async () => {
      const { getGSAP } = await import('../../styles/motion/scroll');
      const { gsap, ScrollTrigger } = await getGSAP();
      if (cancelled) return;

      const headline = headlineRef.current;
      const avail    = availRef.current;
      const water    = isCompact ? null : waterWrapRef.current;
      const ease     = 'cubic-bezier(0.22, 1, 0.36, 1)';

      gsap.set(avail,    { opacity: 0, y: 16 });
      gsap.set(headline, { opacity: 0, y: 44, filter: 'blur(8px)' });

      trigEnter = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter() {
          if (water) gsap.to(water, { opacity: 1, duration: 1.4, ease: 'power2.out' });
          gsap.to(avail,    { opacity: 1, y: 0, duration: 0.5, ease });
          gsap.to(headline, {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.85, delay: 0.15, ease, clearProps: 'filter',
          });
        },
      });

      // Fade water out as the section exits toward the footer.
      if (water) {
        trigExit = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'bottom 55%',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate(self) {
            water.style.opacity = String(Math.max(0, 1 - self.progress));
          },
        });
      }
    })();

    return () => {
      cancelled = true;
      trigEnter?.kill();
      trigExit?.kill();
    };
  }, [prefersReduced, isCompact]);

  return (
    <>
      <section
        ref={sectionRef}
        className={`contact-section${isCompact ? ' contact-section--compact' : ''}`}
        id="contact"
        aria-labelledby="contact-title"
      >
        {!isCompact && (
          <div ref={waterWrapRef} className="contact-water-wrap" aria-hidden="true">
            <WaterBackground strength={0.36} />
          </div>
        )}
        <div className="wrap">
          <div className="contact-card">
            <div className="g12">
              <div className="contact-grid">

                <div className="contact-content">
                  <p ref={availRef} className="contact-avail">
                    <span className="contact-avail__dot" aria-hidden="true" />
                    Available for Freelance • Collaborations
                  </p>

                  <h2 ref={headlineRef} className="contact-headline" id="contact-title">
                    Ready to build
                    <br className="contact-br--hide-mobile" />
                    {' '}something meaningful?
                  </h2>
                </div>

                <button
                  type="button"
                  className="btn btn--out btn--lg contact-cta"
                  aria-haspopup="dialog"
                  aria-expanded={modalOpen}
                  onClick={() => setModalOpen(true)}
                >
                  Contact Me
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rendered as a sibling, not a child, of #contact — StackedReveal
          drives a scroll-linked `transform` directly on #contact, and a
          transform on an ancestor creates a new containing block for
          `position:fixed` descendants. Nested here, the modal's
          `inset:0` would resolve against #contact's box instead of the
          viewport. */}
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
