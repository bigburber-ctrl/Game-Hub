import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Serve the repository `src` folder as the web root so Vite finds index.html
  root: path.resolve(__dirname, '../src'),
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
