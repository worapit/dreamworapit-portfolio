# w0rapit — Portfolio

> UX/UI Designer & Experience Storyteller — PropTech · Education · Digital Signage

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | CSS Design Tokens + Tailwind CSS |
| Animation | GSAP 3 + ScrollTrigger |
| Fonts | Geist (display) · Manrope (body) via `next/font/google` |
| Language | JavaScript (JSX) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                   Next.js App Router pages
├── components/
│   ├── layout/            Nav, Footer, PageWrapper
│   ├── identity/          Hero section
│   ├── showcase/          ProjectCard
│   ├── narrative/         Testimonial
│   └── primitives/        Button, shared atoms
├── styles/
│   ├── tokens/            Design token CSS files
│   ├── motion/            GSAP preset libraries
│   ├── globals.css        CSS entry point
│   └── utilities.css      Helper classes
├── hooks/                 Custom React hooks
└── lib/                   SEO, JSON-LD, project data
```

## Design Token Architecture

```
primitives.css  →  raw values (hex, px, ms)
semantic.css    →  light-mode intent mapping
dark.css        →  dark-mode overrides
component.css   →  component-level tokens
```

## Adding a Project

Edit `src/lib/projects.js` and add an entry. The project card and case study page
template are automatically populated.

## Environment Variables

No environment variables are required for the base portfolio. Add `.env.local` if
you integrate a CMS or contact form backend.

## Deploy

```bash
npm run build   # production build
npm start       # production server
```

One-click deploy to Vercel: connect the repo and deploy — no config needed.
