/** @type {import('tailwindcss').Config} */
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
      animation: {
        bounce: 'bounce 0.6s infinite alternate',
      },
      keyframes: {
        bounce: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Times', 'Times New Roman', 'serif'],
        'mono': ['Menlo', 'Monaco', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}