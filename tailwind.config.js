/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales Banqueando
        cyan: {
          DEFAULT: '#0891B2',
          deep: '#0891B2',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0891B2',
          600: '#0284A8',
          700: '#0369A1',
        },
        purple: {
          DEFAULT: '#5B21B6',
          royal: '#5B21B6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        amber: {
          DEFAULT: '#F59E0B',
          energetic: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        // Neutros
        navy: {
          deep: '#0F172A',
        },
        slate: {
          dark: '#1E293B',
        },
        gray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(180deg, #0891B2 0%, #5B21B6 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        'gradient-button': 'linear-gradient(135deg, #0891B2 0%, #5B21B6 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(91, 33, 182, 0.1) 100%)',
      },
      boxShadow: {
        'brand': '0 0 40px rgba(8, 145, 178, 0.15)',
        'brand-lg': '0 0 60px rgba(8, 145, 178, 0.2)',
      }
    },
  },
  plugins: [],
}
