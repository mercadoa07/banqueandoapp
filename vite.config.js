import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@config': '/config'
    }
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.mjs'],
    setupFiles: ['src/test/setup.js']
  }
})
