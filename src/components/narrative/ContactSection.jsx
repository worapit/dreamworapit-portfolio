'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CONTACT_LINKS = [
  { label: 'Email', href: 'mailto:worapit.m@gmail.com' },
  { label: 'Work', href: 'https://linkedin.com/in/worapit', external: true },
  { label: 'Resume', href: '/resume', internal: true },
];

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
      const { getGSAP } = await import('../../styles/motion/scroll');
      const { gsap, ScrollTrigger } = await getGSAP();
      if (cancelled) return;

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
        <div className="g12">
          <div className="contact-grid">

            <div className="contact-content">
              <p ref={availRef} className="contact-avail">
                <span className="contact-avail__dot" aria-hidden="true" />
                Available for Full-time • Freelance • Collaborations
              </p>

              <h2 ref={headlineRef} className="contact-headline" id="contact-title">
                Ready to build
                <br className="contact-br--hide-mobile" />
                {' '}something meaningful?
              </h2>
            </div>

            <div className="contact-links" aria-label="Contact links">
              {CONTACT_LINKS.map(({ label, href, external, internal }) => (
                internal ? (
                  <Link key={label} href={href} className="contact-link">
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    className="contact-link"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {label}
                  </a>
                )
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
