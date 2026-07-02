import { DM_Sans } from "next/font/google";
import '../styles/globals.css';
import { generateMeta } from '../lib/seo';
import { personSchema, websiteSchema } from '../lib/jsonld';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import Cursor from '../components/ui/Cursor';

/* ── Font via next/font (zero layout shift, self-hosted automatically) ──
   DM Sans is the single global sans-serif — used for both the "display"
   and "body" type roles (--f-display / --f-body both resolve to it).
   The editorial serif (Tiempos Text, loaded via @font-face in globals.css)
   is unrelated and untouched.
   IMPORTANT: the variable className goes on <html>, not <body>. Custom
   properties that reference another custom property (like --f-body
   referencing --font-dm-sans) resolve using the value visible AT THEIR
   OWN declaring element — :root/<html> — not at whatever descendant
   happens to inherit it. Defining --font-dm-sans only on <body> left
   --font-geist/--font-manrope unresolved at :root, which silently made
   every var(--f-body)/var(--f-display) usage site-wide fall back to
   Tailwind's Preflight `ui-sans-serif` default. */
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

/* ── Site-wide metadata ── */
export const metadata = generateMeta();

export default function RootLayout({ children }) {
  return (
    /*
     * suppressHydrationWarning is required because the anti-flash
     * inline <script> sets data-theme on <html> before React hydrates,
     * causing a mismatch between server ("") and client ("dark"/"light").
     */
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <head>
        {/*
         * ANTI-FLASH THEME SCRIPT
         * Runs synchronously before any CSS or JS, preventing the
         * flash of wrong theme on first paint.
         * Must be inline (not defer/async) to block the parser.
         * Defaults to light (not system preference) when nothing is
         * stored yet — matches useTheme.js, which resolves the same way.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var s=localStorage.getItem('w-theme');
  var t=s||'light';
  document.documentElement.setAttribute('data-theme',t);
})();`,
          }}
        />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>

      <body>
        {/* Accessibility: skip to main content */}
        <a href="#main" className="skip-link">Skip to main content</a>

        {/* Custom cursor — desktop/fine-pointer only, pointer-events:none */}
        <Cursor />

        {/* Global nav */}
        <Nav />

        {/*
         * PageWrapper handles the loader overlay + fires 'w0rapit:loaded'
         * so Hero and other animated sections can sequence their entrances.
         */}
        <PageWrapper>
          <main id="main" tabIndex="-1">
            {children}
          </main>
        </PageWrapper>

        <Footer />
      </body>
    </html>
  );
}
