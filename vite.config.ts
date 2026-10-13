import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Vitest runs in 'test' mode and never calls the API, so it shouldn't need a .env.
  if (mode !== 'test' && !env.VITE_API_URL) {
    throw new Error('VITE_API_URL is not set. Copy .env.example to .env, or set it in the build environment.')
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    server: {
      // The API allowlists this exact origin for cookie-authenticated calls.
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://localhost:4100',
          changeOrigin: true,
        },
      },
    },
  }
})
