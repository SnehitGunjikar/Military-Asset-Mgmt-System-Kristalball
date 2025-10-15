/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        army: {
          50: '#f4faf5',
          100: '#e9f5ea',
          200: '#cfe9d2',
          300: '#a6d4ab',
          400: '#7cbc82',
          500: '#4ea45a',
          600: '#3b8647',
          700: '#2e6a39',
          800: '#25552f',
          900: '#1f4627',
        },
      },
    },
  },
  plugins: [],
}