'use client';

import { useEffect, useRef, useState } from 'react';
import { useContactDialog } from './ContactDialogProvider';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import ContactForm from './ContactForm';

const EXIT_DURATION_MS = 420;

export default function ContactDialog() {
  const { isOpen, close, triggerElRef } = useContactDialog();
  const [mounted, setMounted] = useState(false); // stays true through the exit animation
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useFocusTrap(panelRef, isOpen);

  // Mount immediately on open; unmount only after the exit transition
  // finishes, so close animates instead of disappearing instantly.
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else if (mounted) {
      const t = setTimeout(() => setMounted(false), prefersReduced ? 0 : EXIT_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen, mounted, prefersReduced]);

  // Focus management + body scroll lock + Escape to close.
  useEffect(() => {
    if (!isOpen) return;

    const focusTarget = headingRef.current || panelRef.current;
    focusTarget?.focus();

    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      // Restore focus to whatever triggered the dialog.
      triggerElRef.current?.focus?.();
    };
  }, [isOpen, close, triggerElRef]);

  if (!mounted) return null;

  return (
    <div
      className={`contact-dialog ${isOpen ? 'is-open' : ''}`}
      onClick={close}
      aria-hidden={!isOpen}
    >
      <div
        ref={panelRef}
        className="contact-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="contact-dialog__close"
          onClick={close}
          aria-label="Close contact form"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="contact-dialog__grid">
          {/* ── Left — editorial brand panel, no photo ── */}
          <div className="contact-dialog__brand" aria-hidden="true">
            <div className="contact-dialog__brand-glow" />
            <div className="contact-dialog__brand-grid" />

            <span
              className="contact-dialog__monogram"
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

            <div className="contact-dialog__brand-copy">
              <p className="contact-dialog__brand-heading">
                Let&rsquo;s talk about your next product.
              </p>
              <p className="contact-dialog__brand-sub">
                Available for product design, design systems, and selected
                freelance projects.
              </p>
            </div>
          </div>

          {/* ── Right — form ── */}
          <div className="contact-dialog__form-col">
            <h2
              ref={headingRef}
              id="contact-dialog-title"
              className="contact-dialog__title"
              tabIndex={-1}
            >
              Get in touch
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
