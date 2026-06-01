import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api/v1/auth/': { target: 'http://localhost:8001', changeOrigin: true },
      '/api/v1/users/': { target: 'http://localhost:8001', changeOrigin: true },
      '/api/v1/': { target: 'http://localhost:8002', changeOrigin: true }
    }
  }
})
