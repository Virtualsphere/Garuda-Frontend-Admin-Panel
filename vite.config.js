import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://72.61.169.226:5000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://72.61.169.226:5000',
        changeOrigin: true,
      },
    },
  },
})
