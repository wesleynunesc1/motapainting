/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          light: '#f3e5ab',
          DEFAULT: '#d4af37',
          dark: '#b89547',
        },
        dark: {
          DEFAULT: '#0b0d11',
          charcoal: '#14171d',
          surface: '#1c2027',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

