import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found · w0rapit',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="pg-top notfound">
      <div className="notfound__inner">
        {/* Background number */}
        <p aria-hidden="true" className="notfound__bignum">
          404
        </p>

        {/* Foreground content */}
        <div className="notfound__content">
          <p className="eyebrow notfound__eyebrow" aria-hidden="true">
            Not Found
          </p>
          <h1 className="notfound__title">
            Page not found
          </h1>
          <p className="notfound__desc">
            The page you were looking for doesn&rsquo;t exist or has been moved.
          </p>
          <div className="notfound__actions">
            <Link href="/" className="btn btn--pr btn--lg">Go Home</Link>
            <Link href="/#work" className="btn btn-glass btn--lg">View Work</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
