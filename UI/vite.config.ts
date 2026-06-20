import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const uiRoot = dirname(fileURLToPath(import.meta.url))
  const repoRoot = resolve(uiRoot, '..')
  const env = loadEnv(mode, repoRoot, '')
  const apiTarget =
    process.env.VITE_API_PROXY_TARGET ??
    process.env.VITE_API_URL ??
    env.VITE_API_PROXY_TARGET ??
    env.VITE_API_URL ??
    'http://localhost:8000'

  return {
    root: uiRoot,
    envDir: repoRoot,
    plugins: [react()],
    optimizeDeps: {
      entries: ['index.html', 'src/**/*.{ts,tsx}'],
    },
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      watch: {
        ignored: [
          '**/.venv/**',
          '**/__pycache__/**',
          '**/data/**',
          '**/dist/**',
          '**/mlruns/**',
          '**/terraform/**',
        ],
      },
    },
  }
})
