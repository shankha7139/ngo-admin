/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff7e5f',
        secondary: '#feb47b',
        dark: '#333',
      },
    },
  },
  plugins: [],
}
