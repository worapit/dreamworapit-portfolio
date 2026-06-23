'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../../hooks/useTheme';

const NAV_LINKS = [
  { label: 'Work',  href: '/work'  },
  { label: 'About', href: '/about' },
];

export default function Nav() {
  const { toggle, isDark } = useTheme();
  const pathname           = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]    = useState(false);

  // Active link: exact match or prefix match (e.g. /work/[slug] → Work active)
  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + '/');

  // Scroll state (rAF throttled)
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onOutside = (e) => {
      if (!e.target.closest('.nav') && !e.target.closest('.mobile-nav'))
        setOpen(false);
    };
    document.addEventListener('click', onOutside);
    return () => document.removeEventListener('click', onOutside);
  }, [open]);

  return (
    <header role="banner">
      <nav
        className={`nav${scrolled ? ' stuck' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Alignment container — same max-width/padding as .wrap, so the
            logo and the pill line up with the page content below. */}
        <div className="nav__container">

          {/* Logo — always left, links to Home. Plain text, no pill. */}
          <Link href="/" className="nav__logo" aria-label="w0rapit — Home">
            w<span className="nav__logo-accent">0</span>
          </Link>

          {/* The pill — hugs its own content, sits at the right edge of
              the alignment container. Surface (bg/border/shadow) only
              appears once scrolled; see .nav.stuck .nav__pill. */}
          <div className="nav__pill">
            <ul className="nav__links" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={`nav__link${isActive(href) ? ' active' : ''}`}
                    aria-current={isActive(href) ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <span className="nav__divider" aria-hidden="true" />

            <div className="nav__utility">
              {/* Theme toggle */}
              <button
                className="theme-btn"
                onClick={toggle}
                type="button"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={isDark}
              >
                <svg className="icon-sun" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M11.89 4.11l1.06-1.06M3.05 12.95l1.06-1.06"
                    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <svg className="icon-moon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z"
                    stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Desktop CTA */}
              <Link href="/#contact" className="btn btn--pr btn--sm nav__cta">
                Get In Touch
              </Link>

              {/* Hamburger */}
              <button
                className="hamburger"
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 4h12M2 8h12M2 12h12"
                    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        className={`mobile-nav${open ? ' open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        aria-hidden={!open}
      >
        <ul className="mobile-nav__links" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`mobile-nav__link${isActive(href) ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-nav__footer">
          <Link href="/#contact" className="btn btn--pr btn--w" onClick={() => setOpen(false)}>
            Get In Touch
          </Link>
        </div>
      </div>
    </header>
  );
}
