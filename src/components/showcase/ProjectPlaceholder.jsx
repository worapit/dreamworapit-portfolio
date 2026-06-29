/**
 * Shared "no screenshot yet" placeholder — used by both WorkCard and
 * ProjectCard until real project imagery is in place. Only the icon
 * size differs between the two call sites.
 */
export default function ProjectPlaceholder({ size = 28 }) {
  return (
    <div className="proj-placeholder" aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="28" height="22" rx="3"
          stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10" cy="13" r="2.5"
          stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M2 22l7-6 5 5 4.5-6L28 22"
          stroke="currentColor" strokeWidth="1.4"
          strokeLinejoin="round" strokeLinecap="round"
        />
      </svg>
      <span className="proj-placeholder__label">Project Screenshot</span>
    </div>
  );
}
