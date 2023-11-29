/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          1: 'rgba(var(--color-accent-1))',
          2: "rgba(var(--color-accent-2))"
        },
        bg_color: 'rgba(var(--color-bg_color))',
        text_color: 'rgba(var(--color-text_color))',
      }
    },
  },
  plugins: [],
}

