/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Dark mode via data-theme attribute (set on <html>)
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary:   'var(--c-primary)',
        'primary-hover': 'var(--c-primary-h)',
        accent:    'var(--c-accent)',
        'accent-hover':  'var(--c-accent-h)',
        success:   'var(--c-success)',
        bg:        'var(--bg)',
        surface:   'var(--s1)',
        'surface-2': 'var(--s2)',
        tx1:       'var(--tx-1)',
        tx2:       'var(--tx-2)',
        tx3:       'var(--tx-3)',
      },
      fontFamily: {
        display: ['var(--f-display)', 'system-ui', 'sans-serif'],
        body:    ['var(--f-body)',    'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site:    '1280px',
        content: '760px',
      },
      borderRadius: {
        full: '9999px',
        '2xl': '20px',
      },
      boxShadow: {
        card:    'var(--sh-card)',
        lift:    'var(--sh-lift)',
        'glow-s':'var(--glow-s)',
        'glow-m':'var(--glow-m)',
      },
      transitionTimingFunction: {
        expo:   'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        std:    'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
