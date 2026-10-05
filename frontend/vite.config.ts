import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development the frontend runs on 5173 and proxies /api to the backend on
// 8000. In production the bundle is served by FastAPI itself, same origin.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
})
