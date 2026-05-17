import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
  build: {
    // Don't fail on warnings — only fail on actual errors
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "use client" warnings and other non-critical issues
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
  },
  // Suppress dependency optimization errors that crash the dev server
  optimizeDeps: {
    exclude: ['motion-dom'],
  },
})