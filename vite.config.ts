import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.0.237:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 4173,
  },
})

