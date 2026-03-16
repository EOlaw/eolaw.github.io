/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.html',
    './assets/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#ffe08a',
          400: '#ffd27f',
          500: '#ffc451',
          600: '#e6b048',
          700: '#cc9c3f',
        },
        dark: {
          950: '#050505',
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#222222',
          500: '#2a2a2a',
          400: '#333333',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'bounce-slow': 'bounce-slow 2.5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'blink-cursor': 'blink-cursor 1s step-end infinite',
        'fade-in': 'fade-in 0.65s ease forwards',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(255,196,81,0.4)' },
          '70%': { boxShadow: '0 0 0 12px rgba(255,196,81,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255,196,81,0)' },
        },
        'blink-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gold-grid':
          'linear-gradient(rgba(255,196,81,0.04) 1px, transparent 1px), linear-gradient(to right, rgba(255,196,81,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '60px 60px',
      },
    },
  },
  plugins: [],
}

/*
 * ─── HOW TO USE (CLI BUILD) ─────────────────────────────────────────────────
 *
 * 1. Install dependencies (run once):
 *      npm init -y
 *      npm install -D tailwindcss
 *
 * 2. Build CSS:
 *      npx tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css --watch
 *
 * 3. In your HTML files swap the CDN tag:
 *      <!-- Remove: <script src="https://cdn.tailwindcss.com"></script> -->
 *      <link rel="stylesheet" href="/assets/css/output.css">
 *
 * 4. Create assets/css/input.css with:
 *      @tailwind base;
 *      @tailwind components;
 *      @tailwind utilities;
 *
 * ─── CURRENT CDN MODE ────────────────────────────────────────────────────────
 * While using the CDN (<script src="https://cdn.tailwindcss.com">), the inline
 * tailwind.config object inside each HTML file must match the theme defined
 * above. All HTML files already include the matching inline config.
 *
 * ─── HERO SECTION NOTE ───────────────────────────────────────────────────────
 * The hero section is always dark (background: #080a0f) regardless of the
 * site's light/dark theme. The dark.* color palette above (dark-950 through
 * dark-400) provides the necessary shades for hero overlays, stat cards, and
 * orb effects. Do not remove these dark shades — they are used by hero CSS
 * in main.css even when the rest of the page is in light mode.
 * ─────────────────────────────────────────────────────────────────────────────
 */
