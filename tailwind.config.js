/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D52D8',
      },
      fontFamily: {
        arabic: ['IBM Plex Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}