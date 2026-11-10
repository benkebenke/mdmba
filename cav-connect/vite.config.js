import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Unit + integration tests live next to the code (*.test.js[x]).
    // System tests in e2e/ run under Playwright, not Vitest.
    include: ['src/**/*.test.{js,jsx}'],
  },
})
