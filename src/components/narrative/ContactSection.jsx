'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ContactSection() {
  const sectionRef  = useRef(null);
  const headlineRef = useRef(null);
  const availRef    = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || !sectionRef.current) return;

    let trigger = null;
    let cancelled = false;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger }  = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const headline = headlineRef.current;
      const avail   = availRef.current;
      const ease    = 'cubic-bezier(0.22, 1, 0.36, 1)';

      gsap.set(avail,    { opacity: 0, y: 16 });
      gsap.set(headline, { opacity: 0, y: 44, filter: 'blur(8px)' });

      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter() {
          gsap.to(avail, { opacity: 1, y: 0, duration: 0.5, ease });
          gsap.to(headline, {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.85, delay: 0.15, ease, clearProps: 'filter',
          });
        },
      });
    })();

    return () => { cancelled = true; trigger?.kill(); };
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="wrap">
        <div className="contact-content">

          <p ref={availRef} className="contact-avail">
            Available for Full-time • Freelance • Collaborations
          </p>

          <h2 ref={headlineRef} className="contact-headline" id="contact-title">
            Ready to build
            <br className="contact-br--hide-mobile" />
            {' '}something meaningful?
          </h2>

        </div>
      </div>
    </section>
  );
}
