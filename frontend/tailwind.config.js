/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2937',
        paper: '#f8fafc',
        moss: '#2563eb',
        coral: '#2563eb',
        line: '#e2e8f0',
      },
      fontFamily: {
        display: ['Trebuchet MS', 'Segoe UI', 'sans-serif'],
        sans: ['Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
