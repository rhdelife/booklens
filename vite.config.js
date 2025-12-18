import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/data4library': {
        target: 'http://data4library.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/data4library/, '/api'),
        secure: false,
      },
    },
  },
})
