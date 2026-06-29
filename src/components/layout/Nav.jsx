'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '../../hooks/useTheme';

const NAV_LINKS = [
  { label: 'Work',  href: '/work'  },
  { label: 'About', href: '/about' },
];

// Outer alignment row — deliberately WIDER than .wrap/max-w-site (the
// hero/content container). The navbar reads as more spacious/premium
// when it isn't pinned to the same narrower measure as body copy; the
// logo still sits at this row's left edge and the pill at its right
// edge, just with more breathing room than the hero content below.
// This row never carries a background, border, or shadow of its own —
// only the pill does, and only on scroll.
const ROW_BASE =
  'relative z-10 flex h-16 w-full max-w-[1600px] items-center justify-between ' +
  'mx-auto px-6 md:px-12 lg:px-24';

// The action pill — Work / About / theme toggle / Get in Touch. Hugs
// its own content (not the full row), and is the ONLY element that
// ever gets a visible surface, and only once scrolled. No `gap` here
// anymore — each child carries its own margin instead, so the three
// internal relationships (links→divider, divider→actions, within
// actions) can each have a different, deliberate amount of breathing
// room instead of one uniform number. py-1.5 (not py-2) keeps the
// pill's own height close to the 36px CTA/34px icon-buttons it wraps,
// so it never reads taller or bulkier than the CTA sitting inside it.
const PILL_BASE =
  'flex w-fit items-center rounded-full border py-1.5 px-8 ' +
  'transition-[background-color,border-color,box-shadow] duration-300 ease-std';
const PILL_AT_REST = 'bg-transparent border-transparent [box-shadow:none]';
const PILL_SCROLLED =
  'border-[var(--bd-1)] bg-[var(--glass)] [box-shadow:var(--sh-sm)] ' +
  'backdrop-blur-xl backdrop-saturate-[1.4]';

// Shared by the theme toggle and hamburger — same circular icon-button
// shape/border/text-color/transition; each adds only its own one-off
// (visibility breakpoint, or hover surface).
const ICON_BTN_BASE =
  'flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[var(--bd-2)] ' +
  'text-tx2 transition-colors duration-[180ms] hover:border-[var(--bd-3)] hover:text-tx1';

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
        className="nav fixed left-0 right-0 top-[var(--nav-offset)] z-[100]"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Alignment row — same max-width/padding as .wrap. Logo sits at
            its left edge, the pill at its right edge; the row itself is
            always transparent, at rest and on scroll alike. */}
        <div className={ROW_BASE}>

          {/* Logo — always left, links to Home. Never wrapped in the
              scrolled pill surface — stays clean and separate at every
              scroll position. */}
          <Link
            href="/"
            aria-label="w0rapit — Home"
            className="relative z-10 inline-flex items-center no-underline
                       transition-transform duration-[240ms] ease-std
                       motion-safe:hover:-translate-y-px
                       motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] motion-safe:active:duration-[80ms]"
          >
            {/* Mask-based render (not <img>) so the mark picks up the
                theme's actual ink color via currentColor/background,
                instead of a blunt invert() filter — same approach the
                rest of the site uses for every other icon. */}
            <span
              aria-hidden="true"
              className="block w-10 aspect-[49/30] bg-tx1"
              style={{
                WebkitMaskImage: 'url(/w0-logo.svg)',
                maskImage: 'url(/w0-logo.svg)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
          </Link>

          {/* The pill — hugs its own content, sits at the right edge of
              the row. Background/border/blur/shadow only appear here,
              and only once scrolled. */}
          <div className={`${PILL_BASE} ${scrolled ? PILL_SCROLLED : PILL_AT_REST}`}>
            {/* Nav links group — its own 8px padding (hover/focus
                breathing room) plus a 12px margin before the divider;
                combined that's a 20px gap from "About" to the divider
                line — the action-wrapper gap. Work↔About itself stays
                a steady 24px via this gap-6. */}
            <ul className="hidden md:flex items-center gap-6 list-none p-2 mr-3" role="list">
              {NAV_LINKS.map(({ label, href }) => {
                const active = isActive(href);
                return (
                  <li key={label} className="flex">
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative text-sm font-medium no-underline transition-colors duration-150
                        after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-accent after:content-['']
                        after:transition-[width] after:duration-[220ms] after:ease-expo
                        ${active
                          ? 'text-accent-text after:w-full'
                          : 'text-tx2 hover:text-tx1 after:w-0 hover:after:w-full'}`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Divider — a tight 6px margin of its own before the
                action group, deliberately smaller than the 20px gap
                it just had on its other side. */}
            <span aria-hidden="true" className="hidden md:block h-[18px] w-px shrink-0 bg-[var(--bd-2)] mr-1.5" />

            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggle}
                type="button"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={isDark}
                className={`${ICON_BTN_BASE} hover:bg-surface-2`}
              >
                <svg className="block dark:hidden h-[14px] w-[14px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M11.89 4.11l1.06-1.06M3.05 12.95l1.06-1.06"
                    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <svg className="hidden dark:block h-[14px] w-[14px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z"
                    stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Desktop CTA — primary action. Hash link to the Home
                  page's contact section: same-page smooth-scroll on
                  Home (global `scroll-behavior:smooth`), or navigate
                  to "/" and land on #contact from any other page.
                  Hidden below `sm` (640px): at that width the pill is
                  already carrying the logo + toggle + CTA + hamburger
                  in one row with no wrap, and this exact CTA is one
                  tap away in the mobile panel below — showing it
                  twice in <640px of width was the crowding risk, not
                  a need users actually have. */}
              <Link
                href="/#contact"
                className="hidden sm:inline-flex btn btn--pr btn--sm h-9 px-[18px]"
              >
                Get in Touch
              </Link>

              {/* Hamburger */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={open}
                aria-controls="mobile-nav"
                className={`${ICON_BTN_BASE} md:hidden`}
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
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        aria-hidden={!open}
        className={`mobile-nav block md:hidden fixed left-0 right-0 top-[var(--nav-total-h)] z-[99]
                    border-b border-[var(--bd-1)] bg-[var(--glass)] p-3 backdrop-blur-[22px]
                    transition-transform duration-300 ease-expo
                    ${open ? 'translate-y-0' : '-translate-y-[calc(100%+var(--nav-total-h)+8px)]'}`}
      >
        <ul className="flex flex-col gap-[2px] list-none" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-[0.9375rem] font-medium text-tx2 no-underline
                           transition-colors duration-[140ms] hover:text-tx1 hover:bg-surface-2"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-[var(--bd-1)] pt-3">
          <Link
            href="/#contact"
            className="btn btn--pr btn--w"
            onClick={() => setOpen(false)}
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </header>
  );
}
