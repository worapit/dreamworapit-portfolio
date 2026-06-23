/** @type {import('next').Metadata} */
export const defaultMeta = {
  title: 'w0rapit — UX/UI Designer & Experience Storyteller',
  description:
    'UX/UI designer crafting intuitive products across PropTech, Education, and Digital Signage through AI-enhanced workflows.',
  siteUrl: 'https://w0rapit.com',
  ogImage: '/og-image.jpg',
  twitter: '@w0rapit',
};

/**
 * Generates a Next.js Metadata object.
 * Spread into `export const metadata` in any layout or page.
 *
 * @param {Partial<typeof defaultMeta & { path?: string }>} overrides
 * @returns {import('next').Metadata}
 */
export function generateMeta(overrides = {}) {
  const title       = overrides.title       || defaultMeta.title;
  const description = overrides.description || defaultMeta.description;
  const url         = `${defaultMeta.siteUrl}${overrides.path || ''}`;
  const image       = overrides.ogImage     || defaultMeta.ogImage;

  return {
    title,
    description,
    metadataBase: new URL(defaultMeta.siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'w0rapit',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: defaultMeta.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}
