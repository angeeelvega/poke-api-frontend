/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CCFF00',
        secondary: '#171717',
        background: '#000000',
      }
    },
  },
  plugins: [],
}
