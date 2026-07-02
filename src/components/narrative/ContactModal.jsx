'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  EnvelopeIcon, DocumentTextIcon, CheckIcon,
  ChevronDownIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

// ─── Constants ────────────────────────────────────────────────────────────────
const FOCUSABLE =
  'button:not([disabled]),[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const BUDGETS = [
  'Under ฿10,000',
  '฿10,000 – ฿30,000',
  '฿30,000 – ฿50,000',
  '฿50,000 – ฿100,000',
  'Over ฿100,000',
];

// ─── Brand icons (not in heroicons) ──────────────────────────────────────────
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M6.5 8.5v6M6.5 6v.01M10 14.5V10c0-1 .8-1.5 1.7-1.5S13.5 9 13.5 10v4.5"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconGitHub = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2C5.58 2 2 5.58 2 10c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.37c-2.2.48-2.67-1.06-2.67-1.06-.36-.91-.88-1.15-.88-1.15-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.86.86 2.31.66.07-.51.28-.86.5-1.06-1.76-.2-3.6-.88-3.6-3.92 0-.87.31-1.58.82-2.13-.08-.2-.36-1.01.08-2.1 0 0 .67-.21 2.2.82A7.68 7.68 0 0 1 10 6.88c.68 0 1.36.09 2 .27 1.52-1.04 2.2-.82 2.2-.82.44 1.09.16 1.9.08 2.1.51.55.82 1.26.82 2.13 0 3.05-1.85 3.72-3.62 3.91.28.24.54.73.54 1.48v2.19c0 .21.14.46.55.38A8.01 8.01 0 0 0 18 10c0-4.42-3.58-8-8-8z"
      stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconEmail  = () => <EnvelopeIcon    width={18} height={18} aria-hidden="true" />;
const IconResume = () => <DocumentTextIcon width={18} height={18} aria-hidden="true" />;

const SOCIALS = [
  { label: 'Email',    href: 'mailto:worapit.m@gmail.com',      Icon: IconEmail    },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/worapit', external: true, Icon: IconLinkedIn },
  { label: 'GitHub',   href: 'https://github.com/worapit',      external: true, Icon: IconGitHub   },
  { label: 'Resume',   href: '/resume',                                          Icon: IconResume   },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ContactModal({ open, onClose }) {
  // "setState during render" (React's derived-state pattern) to mount the
  // panel on the same render open flips true — avoids a double-render cycle
  // and means the DOM is present before the GSAP effect runs.
  const [rendered,  setRendered]  = useState(open);
  const [prevOpen,  setPrevOpen]  = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setRendered(true);
  }

  const [status,    setStatus]    = useState('idle'); // idle | loading | success | error
  const [errorMsg,  setErrorMsg]  = useState('');

  const backdropRef  = useRef(null);
  const panelRef     = useRef(null);
  const closeBtnRef  = useRef(null);
  const formRef      = useRef(null);
  const tlRef        = useRef(null);
  const prevFocusRef = useRef(null);
  const titleId      = useId();
  const prefersReduced = useReducedMotion();

  // GSAP enter / exit
  useEffect(() => {
    if (!rendered) return;
    let cancelled = false;

    (async () => {
      const { default: gsap } = await import('gsap');
      if (cancelled) return;

      const backdrop = backdropRef.current;
      const panel    = panelRef.current;
      if (!backdrop || !panel) return;

      tlRef.current?.kill();

      if (open) {
        // ── Enter ──────────────────────────────────────────────────────
        const items = Array.from(panel.querySelectorAll('[data-m]'));

        if (prefersReduced) {
          gsap.set(panel,    { y: 0 });
          gsap.set(backdrop, { pointerEvents: 'auto' });
          gsap.to([backdrop, panel, ...items], { opacity: 1, duration: 0.15 });
          return;
        }

        gsap.set(backdrop, { pointerEvents: 'auto' });
        gsap.set(items,    { opacity: 0, y: 12 });

        tlRef.current = gsap.timeline()
          .to(backdrop, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0)
          .to(panel, {
            opacity: 1, y: 0,
            duration: 0.65, ease: 'cubic-bezier(0.22,1,0.36,1)',
          }, 0.04)
          .to(items, {
            opacity: 1, y: 0,
            duration: 0.4, stagger: 0.05,
            ease: 'power2.out', clearProps: 'opacity,transform',
          }, 0.18);
      } else {
        // ── Exit ───────────────────────────────────────────────────────
        gsap.set(backdrop, { pointerEvents: 'none' });

        const dur = prefersReduced ? 0.1 : 0.3;
        tlRef.current = gsap.timeline({
          onComplete() {
            if (!cancelled) {
              setStatus('idle');   // reset form status after panel is gone
              setRendered(false);
            }
          },
        })
          .to(panel,    { opacity: 0, y: '100%', duration: dur, ease: 'power2.in' }, 0)
          .to(backdrop, { opacity: 0, duration: dur + 0.04, ease: 'power2.in' }, 0);
      }
    })();

    return () => { cancelled = true; };
  }, [open, rendered, prefersReduced]);

  // Focus trap + ESC + body-scroll lock + restore focus
  useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => closeBtnRef.current?.focus(), 80);

    function onKeyDown(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE))
        .filter(el => !el.disabled);
      if (!items.length) return;
      const [first, last] = [items[0], items[items.length - 1]];
      if (e.shiftKey  && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      prevFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(Object.fromEntries(new FormData(e.target))),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      setStatus('success');
      formRef.current?.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  if (!rendered) return null;

  return (
    <div
      ref={backdropRef}
      className="cmodal-bg"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        className="cmodal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Close */}
        <button
          ref={closeBtnRef}
          type="button"
          className="cmodal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon width={14} height={14} aria-hidden="true" />
        </button>

        {/* ── LEFT — editorial panel ────────────────────────────────── */}
        <div className="cmodal__left">
          <p className="cmodal__eyebrow" data-m>Get in Touch</p>
          <h2 className="cmodal__heading" id={titleId} data-m>
            Let&rsquo;s build something meaningful.
          </h2>
          <p className="cmodal__desc" data-m>
            I&rsquo;m always excited to collaborate on thoughtful digital products, design systems,
            AI-powered experiences, and ambitious ideas.
          </p>

          <nav className="cmodal__socials" aria-label="Contact links" data-m>
            {SOCIALS.map(({ label, href, external, Icon }) =>
              href.startsWith('/') ? (
                <Link key={label} href={href} className="cmodal__social" aria-label={label}>
                  <Icon />
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="cmodal__social"
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon />
                </a>
              )
            )}
          </nav>

          <div className="cmodal__meta" data-m>
            <span>Based in Thailand</span>
            <span>Available for Freelance &amp; Collaborations</span>
          </div>
        </div>

        {/* ── RIGHT — form ─────────────────────────────────────────── */}
        <div className="cmodal__right">
          <h3 className="cmodal__form-title" data-m>Send a Message</h3>
          <p className="cmodal__form-sub" data-m>
            Fill in the details below and I&rsquo;ll get back to you as soon as possible.
          </p>

          {status === 'success' && (
            <div className="cmodal__toast cmodal__toast--ok" role="status">
              <CheckIcon width={14} height={14} aria-hidden="true" /> Message sent — I&rsquo;ll be in touch soon.
            </div>
          )}
          {status === 'error' && (
            <div className="cmodal__toast cmodal__toast--err" role="alert">
              {errorMsg || 'Something went wrong. Please try again.'}
            </div>
          )}

          <form ref={formRef} className="cmodal__form" onSubmit={handleSubmit} noValidate>
            {/* Row 1: Name + Email */}
            <div className="cmodal__row" data-m>
              <div className="cmodal__field">
                <label className="cmodal__label" htmlFor={`${titleId}n`}>Name *</label>
                <input id={`${titleId}n`} className="cmodal__input" type="text"
                  name="name" required autoComplete="name" placeholder="Your name" />
              </div>
              <div className="cmodal__field">
                <label className="cmodal__label" htmlFor={`${titleId}e`}>Email *</label>
                <input id={`${titleId}e`} className="cmodal__input" type="email"
                  name="email" required autoComplete="email" placeholder="your@email.com" />
              </div>
            </div>

            {/* Row 2: Company + Budget */}
            <div className="cmodal__row" data-m>
              <div className="cmodal__field">
                <label className="cmodal__label" htmlFor={`${titleId}c`}>Company</label>
                <input id={`${titleId}c`} className="cmodal__input" type="text"
                  name="company" autoComplete="organization" placeholder="Your company" />
              </div>
              <div className="cmodal__field">
                <label className="cmodal__label" htmlFor={`${titleId}b`}>Budget</label>
                <div className="cmodal__sel-wrap">
                  <select id={`${titleId}b`} className="cmodal__select" name="budget" defaultValue="">
                    <option value="" disabled>Select budget</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDownIcon className="cmodal__chevron" width={12} height={12} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="cmodal__field" data-m>
              <label className="cmodal__label" htmlFor={`${titleId}m`}>Message *</label>
              <textarea id={`${titleId}m`} className="cmodal__textarea"
                name="message" required rows={4}
                placeholder="Tell me about your project, timeline, and goals…" />
            </div>

            <button
              type="submit"
              className="btn btn--pr btn--w btn--lg"
              disabled={status === 'loading' || status === 'success'}
              data-m
            >
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
