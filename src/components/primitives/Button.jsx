'use client';

import { useEffect, useRef } from 'react';
import { BREAKPOINT_MD } from '../../lib/breakpoints';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Reusable Button primitive.
 *
 * Props:
 *  variant   'primary' | 'outline' | 'ghost' | 'glass'  (default: 'primary')
 *  size      'sm' | 'md' | 'lg'                         (default: 'md')
 *  href      string — renders as <a> if provided
 *  magnetic  boolean — enables GSAP magnetic drift on desktop (default: false)
 *  icon      ReactNode — icon element appended inside button
 *  className string — additional classes
 *  ref       forwarded to the underlying <a>/<button> (React 19: plain
 *            prop, no forwardRef wrapper needed)
 */
export default function Button({
  variant  = 'primary',
  size     = 'md',
  href,
  children,
  className = '',
  magnetic  = false,
  icon,
  ref: externalRef,
  ...props
}) {
  const internalRef = useRef(null);
  const ref = externalRef || internalRef;
  const prefersReduced = useReducedMotion();

  // Magnetic hover effect — desktop only, async GSAP import
  useEffect(() => {
    if (!magnetic || prefersReduced || typeof window === 'undefined') return;
    if (window.innerWidth < BREAKPOINT_MD) return;

    let cleanup = () => {};
    import('../../styles/motion/presets').then(({ magneticButton }) => {
      magneticButton(ref.current).then((fn) => { cleanup = fn; });
    });
    return () => cleanup();
  }, [magnetic, prefersReduced, ref]);

  const variantClass = {
    primary: 'btn--pr',
    outline: 'btn--out',
    ghost:   'btn--ghost',
    glass:   'btn-glass',
  }[variant] ?? 'btn--pr';

  const sizeClass = size === 'lg' ? 'btn--lg' : size === 'sm' ? 'btn--sm' : '';

  const cls = ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ');

  const content = (
    <>
      {children}
      {icon && <span className="btn__icon" aria-hidden="true">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <a ref={ref} href={href} className={cls} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button ref={ref} className={cls} {...props}>
      {content}
    </button>
  );
}
