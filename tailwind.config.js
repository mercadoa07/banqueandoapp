/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'cyan-deep': '#0891B2',
        'royal-purple': '#5B21B6', 
        'energetic-amber': '#F59E0B'
      }
    }
  },
  plugins: []
}
