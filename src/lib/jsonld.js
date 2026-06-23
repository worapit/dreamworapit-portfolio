/**
 * Structured data generators (JSON-LD).
 * Render the output inside a <script type="application/ld+json"> tag.
 *
 * Usage in layout.jsx:
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
 *   />
 */

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Worapit',
    jobTitle: 'UX/UI Designer',
    description:
      'UX/UI Designer & Experience Storyteller specialising in PropTech, Education, and Digital Signage through AI-enhanced workflows.',
    url: 'https://w0rapit.com',
    image: 'https://w0rapit.com/avatar.jpg',
    sameAs: [
      'https://linkedin.com/in/worapit',
      'https://github.com/worapit',
    ],
    knowsAbout: [
      'UX Design', 'UI Design', 'Product Design',
      'Design Systems', 'PropTech', 'EdTech', 'Digital Signage',
      'AI-enhanced Workflows', 'Figma', 'ProtoPie',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'w0rapit',
    url: 'https://w0rapit.com',
    description: 'Portfolio of Worapit — UX/UI Designer & Experience Storyteller',
    author: { '@type': 'Person', name: 'Worapit' },
  };
}

export function projectSchema({ name, description, url, datePublished }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    datePublished,
    author: { '@type': 'Person', name: 'Worapit', url: 'https://w0rapit.com' },
  };
}
