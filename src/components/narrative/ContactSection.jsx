'use client';

import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function ContactSection() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headlineRef = useRef(null);
  const availRef    = useRef(null);
  const linksRef    = useRef(null);
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

      const eyebrow = eyebrowRef.current;
      const headline = headlineRef.current;
      const avail   = availRef.current;
      const links   = linksRef.current ? Array.from(linksRef.current.children) : [];
      const ease    = 'cubic-bezier(0.22, 1, 0.36, 1)';

      gsap.set([eyebrow, avail], { opacity: 0, y: 24 });
      gsap.set(headline,         { opacity: 0, y: 44, filter: 'blur(8px)' });
      gsap.set(links,            { opacity: 0, y: 20 });

      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter() {
          gsap.to(eyebrow, { opacity: 1, y: 0, duration: 0.55, ease });
          gsap.to(headline, {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.85, delay: 0.10, ease, clearProps: 'filter',
          });
          gsap.to(avail, { opacity: 1, y: 0, duration: 0.65, delay: 0.22, ease });
          gsap.to(links, {
            opacity: 1, y: 0,
            duration: 0.50, stagger: 0.09, delay: 0.30, ease,
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
        <div className="contact-layout">

          {/* ── Left ── */}
          <div className="contact-left">
            <p ref={eyebrowRef} className="contact-eyebrow">Get in touch</p>

            <h2 ref={headlineRef} className="contact-headline" id="contact-title">
              Ready to build
              <br className="contact-br--hide-mobile" />
              {' '}something meaningful?
            </h2>

            {/* Liquid glass availability tag */}
            <div ref={availRef} className="contact-avail">
              <span className="contact-avail__dot" aria-hidden="true" />
              <span>Available for full-time, freelance, and collaborations</span>
            </div>
          </div>

          {/* ── Right — action links, all open in new tab ── */}
          <nav ref={linksRef} className="contact-links" aria-label="Contact options">
            <a
              href="mailto:hello@w0rapit.com"
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send an email — opens mail client"
            >
              <span>Email</span>
              <span className="contact-link__arrow" aria-hidden="true">↗</span>
            </a>
            <a
              href="https://linkedin.com/in/worapit"
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile — opens in new tab"
            >
              <span>LinkedIn</span>
              <span className="contact-link__arrow" aria-hidden="true">↗</span>
            </a>
            <a
              href="/resume"
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View resume — opens in new tab"
            >
              <span>Resume</span>
              <span className="contact-link__arrow" aria-hidden="true">↗</span>
            </a>
          </nav>

        </div>
      </div>
    </section>
  );
}
