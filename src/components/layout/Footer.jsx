// Server component — no client state needed
const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/worapit',
    external: true,
    icon: (
      <>
        <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M6.5 8.5v6M6.5 6v.01M10 14.5V10c0-1 .8-1.5 1.7-1.5S13.5 9 13.5 10v4.5"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/worapit',
    external: true,
    icon: (
      <>
        <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="14.3" cy="5.7" r="0.9" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:worapit.m@gmail.com',
    external: false,
    icon: (
      <>
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M3 5.5l7 5.5 7-5.5"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="wrap">
        <div className="footer__row">
          <p className="footer__copy">&copy; 2026 w0rapit</p>

          <nav className="footer__social" aria-label="Social links">
            {SOCIAL_LINKS.map(({ label, href, external, icon }) => (
              <a
                key={label}
                href={href}
                className="footer__social-link"
                aria-label={label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  {icon}
                </svg>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
