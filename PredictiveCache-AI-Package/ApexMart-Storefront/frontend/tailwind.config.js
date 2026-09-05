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
        obsidian: {
          950: '#070a10',
          900: '#0c101a',
          800: '#131929',
          700: '#1b233a',
          600: '#263152',
          border: '#1e293b',
        },
        prime: {
          gold: '#fbbf24',
          orange: '#ff9900',
          blue: '#00a8e1',
          cyan: '#38bdf8'
        }
      }
    },
  },
  plugins: [],
}
