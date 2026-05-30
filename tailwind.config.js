/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // University-themed custom premium colors
        university: {
          50: '#f0f3ff',
          100: '#e1e7ff',
          200: '#c8d2ff',
          300: '#a4b3ff',
          400: '#7a8bff',
          500: '#4f5eff',
          600: '#383eff',
          700: '#2b2bd6',
          800: '#2424b0',
          900: '#1f208c',
          950: '#121252',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        }
      }
    },
  },
  plugins: [],
}

