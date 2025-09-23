import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    //pakai proxy karna kena cors jika langsung request (cors setting dari backend salah (*,))
    proxy: {
      '/api': {
        target: 'https://take-home-test-api.nutech-integrasi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
    
  },
  plugins: [
    react(),

  ],
  resolve: {
    alias: {
      '@workspace/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@workspace/tailwind': path.resolve(__dirname, '../../packages/tailwind'),
      "@": path.resolve(__dirname, "./src"),
    }
  },
  optimizeDeps: {
    include: ['@workspace/ui', '@workspace/tailwind']
  },
})