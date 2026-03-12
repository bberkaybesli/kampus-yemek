import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // API isteklerini backend'e yönlendir (proxy)
    proxy: {
      '/restoranlar': 'http://localhost:5000',
      '/siparisler':  'http://localhost:5000',
      '/analiz':      'http://localhost:5000',
    },
  },
})
