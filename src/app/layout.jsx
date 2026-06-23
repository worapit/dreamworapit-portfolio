import { Inter, Manrope } from "next/font/google";
import '../styles/globals.css';
import { generateMeta } from '../lib/seo';
import { personSchema, websiteSchema } from '../lib/jsonld';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import Cursor from '../components/ui/Cursor';

/* ── Fonts via next/font (zero layout shift, self-hosted automatically) ── */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
         * ANTI-FLASH THEME SCRIPT
         * Runs synchronously before any CSS or JS, preventing the
         * flash of wrong theme on first paint.
         * Must be inline (not defer/async) to block the parser.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var s=localStorage.getItem('w-theme');
  var t=s||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
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

      <body className={`${inter.variable} ${manrope.variable}`}>
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
