import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/PackingList': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/trips': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/expenses': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/currency': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
