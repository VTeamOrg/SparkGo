/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      scale: {
        '-100': '-1',
      },
      colors: {
        accent: {
          1: 'rgba(var(--color-accent-1))',
          2: "rgba(var(--color-accent-2))"
        },
        bg_color: {
          1: 'rgba(var(--color-bg_color-1))',
          2: 'rgba(var(--color-bg_color-2))',
        },
        text_color: {
          1: 'rgba(var(--color-text_color-1))',
          2: 'rgba(var(--color-text_color-2))',
        },
        shadow_color: {
          1: 'rgba(var(--color-shadow-1))',
        },
      }
    },
  },
  plugins: [],
}

