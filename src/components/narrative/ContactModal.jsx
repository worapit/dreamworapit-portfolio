'use client';

import { useEffect, useId, useRef, useState } from 'react';

// Matches the CSS transition duration below (--dur-page, 600ms) — the
// panel stays mounted through the closing fade/slide so it can animate
// out, then actually leaves the DOM once the transition finishes.
const CLOSE_DELAY = 600;

const FOCUSABLE = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen contact form takeover. No email backend exists yet (no
 * /api route in this project) — submit is intentionally a no-op that
 * just acknowledges the message locally; see the summary in chat for
 * what wiring a real send would need.
 */
export default function ContactModal({ open, onClose }) {
  const [rendered, setRendered] = useState(open);
  const [status, setStatus] = useState('idle'); // idle | submitted
  const [prevOpen, setPrevOpen] = useState(open);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocused = useRef(null);
  const titleId = useId();

  // Adjust state during render (React's documented pattern for
  // "derive state from a prop change") instead of in an effect — opening
  // must mount synchronously in the same render so the very first paint
  // already has the panel in the DOM for the CSS transition to animate
  // from, and this also resets the form's submitted note.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setRendered(true);
    else setStatus('idle');
  }

  // Closing is delayed — the panel stays mounted through the CSS fade/
  // slide before actually leaving the DOM.
  useEffect(() => {
    if (open || !rendered) return;
    const t = setTimeout(() => setRendered(false), CLOSE_DELAY);
    return () => clearTimeout(t);
  }, [open, rendered]);

  // Focus trap + Escape + body scroll lock + focus restore — only live
  // while the dialog is actually open (not during the closing fade).
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 50);

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE))
        .filter((el) => !el.disabled && el.getAttribute('aria-hidden') !== 'true');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!rendered) return null;

  function handleSubmit(e) {
    e.preventDefault();
    // No /api route exists yet — see chat summary for what's needed to
    // actually send this. Left as a local acknowledgement, not a fake
    // "sent" confirmation.
    setStatus('submitted');
  }

  return (
    <div
      className={`contact-modal ${open ? 'is-open' : ''}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        className="contact-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="contact-modal__close"
          onClick={onClose}
          aria-label="Close contact form"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <h2 id={titleId} className="contact-modal__title">Let&rsquo;s talk</h2>
        <p className="contact-modal__sub">Tell me a bit about what you&rsquo;re building.</p>

        <form className="contact-modal__form" onSubmit={handleSubmit}>
          <label className="contact-modal__field">
            <span>Name</span>
            <input type="text" name="name" required autoComplete="name" />
          </label>
          <label className="contact-modal__field">
            <span>Email</span>
            <input type="email" name="email" required autoComplete="email" />
          </label>
          <label className="contact-modal__field">
            <span>Message</span>
            <textarea name="message" rows={5} required />
          </label>

          <button
            type="submit"
            className="btn btn--pr btn--w"
            disabled={status === 'submitted'}
          >
            {status === 'submitted' ? 'Noted' : 'Send message'}
          </button>
          {status === 'submitted' && (
            <p className="contact-modal__note" role="status">
              Thanks — this form isn&rsquo;t connected to send email yet.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
