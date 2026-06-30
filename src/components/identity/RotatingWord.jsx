'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const WORDS = ['digital', 'PropTech', 'EdTech'];
const INTERVAL_MS = 2800;   // pause between changes
const TRANSITION_MS = 600;  // slide duration

/**
 * Inline word carousel for the hero headline — cycles through WORDS with
 * a clean vertical slide, modeled on the Linear/Vercel style: the
 * outgoing word slides up and fades out while the incoming word slides
 * up and fades in, fully in sync. Both are absolutely positioned inside
 * a fixed-height, overflow:hidden box — never animating height — so
 * there is no ghosting, no overlap, and no leftover glyphs once a
 * transition finishes (the outgoing word is unmounted entirely).
 */
export default function RotatingWord() {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [settled, setSettled] = useState(true);

  // Advance the word on an interval. Capture the outgoing index from the
  // updater's previous value (not the closed-over `index`) so this stays
  // correct even though the effect itself only depends on prefersReduced.
  useEffect(() => {
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % WORDS.length;
      });
      setSettled(false);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [prefersReduced]);

  // Two-phase commit: the tick above renders the new word "entering" and
  // the old word "active" in one frame, then — a frame later, so the
  // browser actually paints the starting position first — we flip both
  // to their resting states in the same step. That's what makes the CSS
  // transition animate instead of jumping straight to the end state.
  useEffect(() => {
    if (settled) return;
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setSettled(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [settled]);

  // Drop the outgoing word from the DOM once its leave transition has
  // actually finished — this is what guarantees no leftover/ghost glyphs.
  useEffect(() => {
    if (prevIndex === null) return;
    const t = window.setTimeout(() => setPrevIndex(null), TRANSITION_MS + 60);
    return () => window.clearTimeout(t);
  }, [prevIndex]);

  if (prefersReduced) {
    return <span className="hero__rotating-word hero__rotating-word--static">{WORDS[0]}</span>;
  }

  return (
    <span className="hero__rotating-word" data-gsap="" data-hero-word="">
      {/* Invisible sizer — reserves width for the longest word so the
          surrounding sentence never reflows as words swap. */}
      <span className="hero__rotating-word-sizer" aria-hidden="true">PropTech</span>

      {prevIndex !== null && (
        <span
          key={`prev-${prevIndex}`}
          aria-hidden="true"
          className={`hero__rotating-word-item ${settled ? 'hero__rotating-word-item--leaving' : 'hero__rotating-word-item--active'}`}
        >
          {WORDS[prevIndex]}
        </span>
      )}

      <span
        key={`cur-${index}`}
        className={`hero__rotating-word-item ${settled ? 'hero__rotating-word-item--active' : 'hero__rotating-word-item--entering'}`}
      >
        {WORDS[index]}
      </span>
    </span>
  );
}
