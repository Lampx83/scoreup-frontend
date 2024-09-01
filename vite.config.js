import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// Detect environment to set base path
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  plugins: [react(), svgr()],
  base: basePath,
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
