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
        apts: {
          bg: '#090d16',
          surface: '#0f172a',
          card: '#131c31',
          cardHover: '#18243e',
          border: '#1e293b',
          borderHover: '#334155',
          primary: '#06b6d4',       // Vibrant Cyan
          primaryHover: '#0891b2',
          accent: '#6366f1',        // Electric Indigo
          accentHover: '#4f46e5',
          flash: '#f43f5e',         // Flash Sale Crimson
          deal: '#f59e0b',          // Amber Deal
          success: '#10b981',       // Emerald in-stock
          textMuted: '#94a3b8',
          textLight: '#f8fafc'
        }
      },
      boxShadow: {
        'glow-primary': '0 0 20px -3px rgba(6, 182, 212, 0.3)',
        'glow-flash': '0 0 20px -3px rgba(244, 63, 94, 0.35)',
        'card-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
