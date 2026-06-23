'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import Testimonial from '../narrative/Testimonial';

const SPEED = 0.45; // px per frame — ~27px/s at 60fps (slow, premium)

export default function TestimonialCarousel({ items }) {
  const trackRef       = useRef(null);
  const animRef        = useRef(null);
  const pausedRef      = useRef(false);
  const dragRef        = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const prefersReduced = useReducedMotion();

  // ── Seamless auto-scroll loop ──────────────────────────────────
  const tick = useCallback(() => {
    const el = trackRef.current;
    if (el && !pausedRef.current) {
      el.scrollLeft += SPEED;
      // When we've scrolled past the first copy, jump back seamlessly
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
    }
    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [prefersReduced, tick]);

  // ── Pause / resume helpers ─────────────────────────────────────
  const pause  = useCallback(() => { pausedRef.current = true; }, []);
  const resume = useCallback((delay = 0) => {
    if (delay > 0) setTimeout(() => { pausedRef.current = false; }, delay);
    else pausedRef.current = false;
  }, []);

  // ── Mouse drag ─────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    pause();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: trackRef.current.scrollLeft,
    };
    trackRef.current.classList.add('is-dragging');
  }, [pause]);

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    trackRef.current.scrollLeft = dragRef.current.scrollLeft - dx;
  }, []);

  const endDrag = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    trackRef.current?.classList.remove('is-dragging');
    resume(1000);
  }, [resume]);

  const onMouseLeave = useCallback(() => {
    endDrag();
    // Resume immediately if not dragging when mouse leaves
    if (!dragRef.current.active) resume(0);
  }, [endDrag, resume]);

  // ── Prevent accidental clicks after drag ───────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleClick = (e) => {
      const dx = Math.abs(e.clientX - dragRef.current.startX);
      if (dx > 4) { e.preventDefault(); e.stopPropagation(); }
    };
    track.addEventListener('click', handleClick, true);
    return () => track.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <div className="testi-carousel">
      <div
        ref={trackRef}
        className="testi-carousel__track"
        role="list"
        aria-label="Testimonials"
        onMouseEnter={pause}
        onMouseLeave={onMouseLeave}
        onFocus={pause}
        onBlur={() => resume(300)}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onTouchStart={pause}
        onTouchEnd={() => resume(1600)}
      >
        {/* Original items — accessible */}
        {items.map((t) => (
          <div key={t.name} className="testi-carousel__item" role="listitem">
            <Testimonial {...t} />
          </div>
        ))}
        {/* Duplicate items — visual-only, hidden from assistive tech */}
        {items.map((t) => (
          <div
            key={`dup-${t.name}`}
            className="testi-carousel__item"
            aria-hidden="true"
            tabIndex={-1}
          >
            <Testimonial {...t} />
          </div>
        ))}
      </div>

      {/* Fade edge gradients */}
      <div className="testi-carousel__fade-l" aria-hidden="true" />
      <div className="testi-carousel__fade-r" aria-hidden="true" />
    </div>
  );
}
