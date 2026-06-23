import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found · w0rapit',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div
      style={{
        paddingTop: 'var(--nav-h)',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--px-sm)',
          position: 'relative',
        }}
      >
        {/* Background number */}
        <p
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(8rem, 25vw, 18rem)',
            fontFamily: 'var(--f-display)',
            fontWeight: 900,
            letterSpacing: '-.06em',
            color: 'var(--bd-2)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          404
        </p>

        {/* Foreground content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }} aria-hidden="true">
            Not Found
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 700,
              letterSpacing: '-.03em',
              margin: '.5rem 0 1rem',
            }}
          >
            Page not found
          </h1>
          <p style={{ color: 'var(--tx-2)', maxWidth: '380px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            The page you were looking for doesn&rsquo;t exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: '.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn--pr btn--lg">Go Home</Link>
            <Link href="/#work" className="btn btn-glass btn--lg">View Work</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
