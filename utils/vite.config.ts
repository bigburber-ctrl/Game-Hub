import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Keep Vite root in `utils` so dependency resolution uses `utils/node_modules`
  root: path.resolve(__dirname),
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the workspace src directory (one level up)
      '@': path.resolve(__dirname, '../src'),
    },
  },
  optimizeDeps: {
    include: ['framer-motion', 'sonner'],
  },
})
