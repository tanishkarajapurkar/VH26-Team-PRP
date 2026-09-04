/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          DEFAULT: '#131921',
          light: '#232f3e',
          subnav: '#232f3e',
          yellow: '#ffd814',
          yellowHover: '#f7ca00',
          orange: '#ffa41c',
          orangeHover: '#fa8900',
          blue: '#007185',
          link: '#007185',
          linkHover: '#c7511f',
          red: '#b12704',
          badgeRed: '#cc0c39',
          prime: '#00a8e1',
          border: '#d5d9d9',
          bg: '#eaeded'
        }
      }
    },
  },
  plugins: [],
}
