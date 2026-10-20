/** @type {import('tailwindcss').Config} */
// Identidad visual (rediseño 2026-10-20): base clara y sobria, un solo acento cian sólido,
// franjas oscuras puntuales. Display: Schibsted Grotesk. Texto: Onest.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Onest', 'Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Schibsted Grotesk"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        // Claro
        ink: '#0D1517',
        muted: '#5A676D',
        line: '#DFE5E7',
        paper: '#F5F7F7',
        accent: { DEFAULT: '#0A8A9E', soft: '#E3F3F5', strong: '#087586' },
        good: '#137A4B',
        bad: '#B4412F',
        // Franjas oscuras
        night: { DEFAULT: '#0A0C0D', surface: '#15191B', line: '#2A3135', ink: '#F1F4F5', muted: '#98A3A8', accent: '#5CCFDD' },
        // Se mantienen por compatibilidad con pantallas aún no rediseñadas
        'cyan-deep': '#0891B2',
        'royal-purple': '#5B21B6',
        'energetic-amber': '#F59E0B'
      }
    }
  },
  plugins: []
}
