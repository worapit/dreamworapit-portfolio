/**
 * Project data — single source of truth used by:
 *   - Homepage work section
 *   - work/[slug] dynamic route
 *   - sitemap generation
 */

export const PROJECTS = [
  /* ── 1. MyStock — featured flagship ─────────────────────────── */
  {
    slug: 'mystock',
    title: 'MyStock',
    showOnHome: true,
    workSection: 'product',
    category: 'PropTech',
    company: 'Livinginsider',
    role: 'Product Designer',
    year: '2025',
    tools: ['Figma', 'FigJam', 'Notion'],
    tags: ['PropTech', 'Design System', 'Web', 'Mobile'],
    editorialMeta: 'Livinginsider | MyStock',
    headline: 'Redesigning property listing workflows to make posting faster and easier',
    shortDesc:
      'Simplified property listing workflows across web and mobile while building a scalable design system for a growing PropTech platform.',
    outcome: 'Unified listing and inventory workflow across web and mobile',
    gradient: 'linear-gradient(135deg,#06101E 0%,#0C2340 50%,#174B7A 100%)',
    icon: null,
    overview:
      'MyStock is a property listing and inventory management platform for Livinginsider, one of Thailand\'s leading property portals. Agents managing large portfolios needed a single place to create, update, and monitor listings across web and mobile without losing context between platforms.',
    challenge:
      'Property agents were managing listings across disconnected tools, leading to duplicated effort, inconsistent data, and slow response times to buyer enquiries. There was no shared design language across the product surfaces, meaning every new feature had to solve foundational UI problems from scratch.',
    process: [
      'Conducted workflow interviews with 12 agents managing 50–200+ listings each',
      'Mapped the end-to-end listing lifecycle across web and mobile touchpoints',
      'Designed a component-first system covering listing forms, status flows, and inventory dashboards',
      'Validated with agents through three rounds of iterative prototype testing',
    ],
    result:
      'Listing creation was unified across platforms, reducing agent context-switching between tools. The design system shipped with 40+ components, giving the team a consistent foundation that accelerated future feature development.',
  },

  /* ── 2. Livinginsider | Design System ──────────────────────── */
  {
    slug: 'livinginsider-design-system',
    title: 'Livinginsider | Design System',
    showOnHome: true,
    workSection: 'product',
    category: 'PropTech',
    company: 'Livinginsider',
    role: 'Product Designer',
    year: '2025',
    tools: ['Figma', 'FigJam', 'Storybook'],
    tags: ['PropTech', 'Design System', 'Component Library'],
    editorialMeta: 'Livinginsider | Design System',
    headline: 'Building a scalable design system to make product development faster and more consistent',
    shortDesc:
      'Building a scalable design system to make product development faster and more consistent.',
    outcome: 'A shared component library that cut design-to-dev handoff time across product teams',
    gradient: 'linear-gradient(135deg,#0A0A12 0%,#1A1A30 50%,#33336B 100%)',
    icon: null,
    overview:
      'As Livinginsider\'s product surfaces grew across MyStock and other internal tools, every new feature was re-solving the same foundational UI problems. This project consolidated those patterns into a single, scalable design system shared across web and mobile.',
    challenge:
      'Design and engineering were duplicating effort because there was no shared language for components, spacing, or interaction patterns. Each new feature shipped with its own one-off styling, making the product feel inconsistent and slowing down both design and development.',
    process: [
      'Audited existing product surfaces to identify recurring UI patterns and inconsistencies',
      'Defined core design tokens — color, spacing, typography — as the system\'s foundation',
      'Built a component library in Figma paired with documented usage guidelines',
      'Partnered with engineering to align component behaviour with implementation in Storybook',
    ],
    result:
      'Product teams now build on a shared, documented component library instead of one-off styling, reducing design-to-dev handoff time and giving every new feature a consistent foundation to build on.',
  },

  /* ── 3. SDQueue ─────────────────────────────────────────────── */
  {
    slug: 'sdqueue',
    title: 'SDQueue',
    showOnHome: true,
    workSection: 'product',
    category: 'SaaS',
    company: 'Freelance Project',
    role: 'Product Designer',
    year: '2025',
    tools: ['Figma', 'Principle', 'Miro'],
    tags: ['SaaS', 'Real-Time', 'Operations'],
    editorialMeta: 'CMU Engineering | SDQueue',
    headline: 'Improving service experiences through real-time queue visibility',
    shortDesc:
      'Reduced customer walkouts by giving service businesses real-time queue visibility on both sides of the counter.',
    outcome: 'Real-time queue visibility for customers and operational control for staff',
    gradient: 'linear-gradient(135deg,#140800 0%,#321400 50%,#7A3000 100%)',
    icon: null,
    overview:
      'SDQueue is a real-time queue management system for service businesses operating at high volume. The platform serves two audiences simultaneously: customers waiting in queues who need position transparency, and staff who need operational control during peak demand.',
    challenge:
      'Customers had no visibility into their queue position, causing walkouts and frustration. Staff lacked real-time controls, leading to service bottlenecks during peak hours. Existing solutions solved one side of the problem but not both.',
    process: [
      'Shadowed service staff and observed customer behaviour across three high-volume venues',
      'Identified eight key moments where ambiguity caused the most service friction',
      'Designed parallel interfaces — a customer-facing queue view and a staff operations dashboard',
      'Tested with service managers using high-fidelity Principle prototypes under simulated peak conditions',
    ],
    result:
      'The platform improved wait-time transparency for customers and gave staff a single operational view across all service points, directly reducing the ambiguity that drives walkouts in high-volume service environments.',
  },

  /* ── 4. Puff & Pi ───────────────────────────────────────────── */
  {
    slug: 'puff-and-pine',
    title: 'Puff & Pi',
    showOnHome: true,
    workSection: 'product',
    category: 'Marketing',
    company: 'THAI Catering',
    role: 'UX/UI Designer',
    year: '2024',
    tools: ['Figma', 'Webflow'],
    tags: ['Marketing', 'Landing Page', 'Conversion'],
    editorialMeta: 'THAI Catering | Puff & Pi',
    headline: 'Elevating a catering brand through a modern digital experience',
    shortDesc:
      'Drove catering enquiries through a premium single-scroll campaign with a clear, low-friction conversion path.',
    outcome: 'Single-scroll conversion page optimised from awareness to enquiry',
    gradient: 'linear-gradient(135deg,#140800 0%,#3A1A08 50%,#7A3A10 100%)',
    icon: null,
    overview:
      'Puff & Pi is a catering brand operating in Thailand\'s premium food and events market. The project was a seasonal campaign landing page designed to convert first-time visitors into catering enquiries through a single, focused experience.',
    challenge:
      'The brand needed to communicate premium positioning, seasonal offerings, and a clear call to action — all within a single-scroll page that worked across desktop and mobile without losing the warmth of the brand identity.',
    process: [
      'Analysed competitor landing pages to identify effective conversion patterns',
      'Developed a content hierarchy that balanced brand storytelling with conversion objectives',
      'Designed responsive layouts with a warm visual language matching the brand identity',
      'Iterated on CTA placement and copy based on stakeholder feedback rounds',
    ],
    result:
      'The page successfully communicated the seasonal offering and drove catering enquiries through a clear linear structure — from first impression to enquiry — with no navigational distractions.',
  },

  /* ── 5. ScoreOBE+ ───────────────────────────────────────────── */
  {
    slug: 'scoreobeplus',
    title: 'ScoreOBE+',
    showOnHome: true,
    workSection: 'product',
    category: 'EdTech',
    company: 'Chiang Mai University',
    role: 'UX Designer',
    year: '2025',
    tools: ['Figma', 'Maze', 'Google Forms'],
    tags: ['EdTech', 'Multi-Role', '800+ Users'],
    editorialMeta: 'ScoreOBE+ | Outcome-Based Education',
    headline: 'Enabling better academic outcomes through intuitive education tools',
    shortDesc:
      'Turned a complex accreditation framework into navigable workflows for 800+ students, instructors, and administrators.',
    outcome: '800+ users across three academic roles onboarded without formal training',
    gradient: 'linear-gradient(135deg,#031008 0%,#072818 50%,#0A5530 100%)',
    icon: null,
    overview:
      'ScoreOBE+ is an outcome-based education platform for Chiang Mai University, serving 800+ students, instructors, and administrators. The platform manages academic planning, assessment, and compliance reporting required by Thailand\'s higher-education accreditation framework.',
    challenge:
      'The OBE framework is structurally complex, requiring multi-role data input and cross-referenced reporting. The existing process relied on disconnected spreadsheets and email chains, making compliance slow and error-prone across all three user groups.',
    process: [
      'Interviewed students, instructors, and administrators to map role-specific workflows',
      'Identified 11 friction points in the existing spreadsheet-based process',
      'Designed role-based dashboards with progressive disclosure to reduce cognitive overhead',
      'Conducted usability testing with 20 participants across all three user groups using Maze',
    ],
    result:
      '800+ users were onboarded without formal training sessions. Assessment submission became a structured guided workflow, and compliance reporting was consolidated from fragmented email chains into a single audit-ready system.',
  },

  /* ── 6. PixelParade — work page only ─────────────────────────── */
  {
    slug: 'pixelparade',
    title: 'PixelParade',
    showOnHome: false,
    workSection: 'product',
    category: 'Digital Signage',
    company: 'Personal Project',
    role: 'Product Designer',
    year: '2024',
    tools: ['Figma', 'FigJam', 'Storybook'],
    tags: ['Digital Signage', 'CMS', 'Multi-Location'],
    editorialMeta: 'PixelParade | Digital Signage Platform',
    headline: 'Empowering teams to manage digital displays at scale',
    shortDesc:
      'Scaled content publishing across multi-location display networks without exposing operational complexity to everyday users.',
    outcome: 'Multi-location scheduling made accessible to non-technical operators',
    gradient: 'linear-gradient(135deg,#030814 0%,#060F30 50%,#0B1E78 100%)',
    icon: null,
    overview:
      'PixelParade is a digital signage content management system that supports operators managing content across distributed networks of screens. The platform is designed to serve two audiences: non-technical coordinators who need simple publishing, and experienced operators who need advanced scheduling control.',
    challenge:
      'Existing signage CMS tools were either too complex for everyday staff or too simplified for power users. There was no product that served both audiences without compromising the needs of either.',
    process: [
      'Defined two primary personas: content coordinators and system administrators',
      'Designed a layered interface — a simple mode for routine publishing, an advanced mode for complex scheduling',
      'Created a scheduling calendar that makes multi-screen, multi-location content conflicts visible at a glance',
      'Self-tested core flows against real-world scheduling scenarios across multiple screen types',
    ],
    result:
      'The layered interface allowed non-technical coordinators to publish content independently while giving administrators the advanced controls needed for complex, multi-location scheduling — without exposing unnecessary complexity to either group.',
  },

  /* ── 7. Giftiny — work page only ────────────────────────────── */
  {
    slug: 'giftiny',
    title: 'Giftiny',
    showOnHome: false,
    workSection: 'case-study',
    category: 'E-Commerce',
    company: 'Case Study',
    role: 'Product Designer',
    year: '2024',
    tools: ['Figma', 'Maze', 'Notion'],
    tags: ['E-Commerce', 'Marketplace', 'Two-Sided Platform'],
    shortDesc:
      'Helped creators launch and sell custom products by abstracting print-on-demand complexity from both sides of the marketplace.',
    outcome: 'End-to-end two-sided marketplace with production complexity abstracted from both sides',
    gradient: 'linear-gradient(135deg,#140308 0%,#300818 50%,#6B0F30 100%)',
    icon: null,
    overview:
      'Giftiny is a print-on-demand marketplace case study exploring the design of a two-sided platform connecting independent creators with buyers seeking custom products. The platform manages the full lifecycle from creator product setup through to buyer purchase and order fulfilment.',
    challenge:
      'Print-on-demand platforms carry inherent complexity: creators need powerful product customisation tools while buyers need a simple, confident purchase experience. The production and fulfilment layer between them must be invisible to both — and the design has to hold that boundary.',
    process: [
      'Mapped end-to-end journeys for both creator and buyer personas separately',
      'Designed a creator dashboard covering product creation, variant management, and storefront publishing',
      'Designed a buyer-facing customisation flow that made product options feel approachable rather than technical',
      'Tested both flows with representative users using Maze to identify points of confusion',
    ],
    result:
      'The platform achieved a clear separation between creator-facing complexity and buyer-facing simplicity. Production and fulfilment were abstracted entirely into the system workflow — neither side needed to understand the other\'s domain to complete their task.',
  },

  /* ── 8. Robinhood Redesign — work page only ─────────────────── */
  {
    slug: 'robinhood-redesign',
    title: 'Robinhood Redesign',
    showOnHome: false,
    workSection: 'case-study',
    category: 'Food Delivery',
    company: 'Product Redesign Concept',
    role: 'Product Designer',
    year: '2024',
    tools: ['Figma', 'Maze', 'Miro'],
    tags: ['Food Delivery', 'Redesign', 'UX Research'],
    shortDesc:
      'Reframed a drop-off problem as an architecture failure and redesigned the ordering flow around observed user intent.',
    outcome: 'Reduced ordering friction by redesigning navigation architecture around user intent',
    gradient: 'linear-gradient(135deg,#140303 0%,#340808 50%,#8B0E0E 100%)',
    icon: null,
    overview:
      'Robinhood is a Thai food delivery platform. This product redesign concept was driven by user research that identified navigation architecture failures causing high-intent users to abandon the ordering flow before checkout.',
    challenge:
      'Initial analysis suggested the drop-off was a UI styling issue. User research revealed the real problem: discovery paths were burying high-intent users under irrelevant content, and the information architecture was not aligned with how users actually make ordering decisions.',
    process: [
      'Conducted 10 user interviews and 6 usability sessions with existing Robinhood users',
      'Built a journey map revealing 4 decision moments where users lost ordering confidence',
      'Redesigned the information architecture to prioritise intent-matching over algorithmic promotion',
      'Prototyped and tested 3 navigation paradigms with real users to validate the architectural direction',
    ],
    result:
      'The redesigned architecture reduced steps between search and checkout, improved food discovery confidence, and directly addressed the primary drop-off points identified during research — demonstrating that the problem was structural, not cosmetic.',
  },
];

/** Get a project by slug. Returns undefined if not found. */
export function getProject(slug) {
  return PROJECTS.find((p) => p.slug === slug);
}

/** All slugs — used in generateStaticParams. */
export function getAllSlugs() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}
