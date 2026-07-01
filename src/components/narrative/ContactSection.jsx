'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 5.5l7 5.5 7-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WorkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M6.5 8.5v6M6.5 6v.01M10 14.5V10c0-1 .8-1.5 1.7-1.5S13.5 9 13.5 10v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ResumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11 2H5a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V6l-5-4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 2v4h4M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const CONTACT_LINKS = [
  { label: 'Email',  href: 'mailto:worapit.m@gmail.com', Icon: EmailIcon },
  { label: 'Work',   href: 'https://linkedin.com/in/worapit', external: true, Icon: WorkIcon },
  { label: 'Resume', href: '/resume', internal: true, Icon: ResumeIcon },
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

            <nav className="contact-links" aria-label="Contact links">
              {CONTACT_LINKS.map(({ label, href, external, internal, Icon }) => (
                internal ? (
                  <Link key={label} href={href} className="contact-link">
                    <Icon />
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    className="contact-link"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <Icon />
                    {label}
                  </a>
                )
              ))}
            </nav>

          </div>
        </div>
      </div>
    </section>
  );
}
