// vite.config.js (en tu carpeta frontend)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto del frontend
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 👈 Puerto de tu backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path // Mantiene /api en la URL
      }
    }
  }
})