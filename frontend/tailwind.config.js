/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C9AFF',
        white: '#ffff',
        black: '#222222',
        dark: '#101010',
        light: '#F6FCFF'
      }
    },
  },
  plugins: [],
}

