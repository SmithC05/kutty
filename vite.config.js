import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const normalized = id.replace(/\\/g, '/');
            if (normalized.includes('node_modules/three/')) {
              return 'three-core';
            }
            if (normalized.includes('node_modules/@react-three/') || normalized.includes('node_modules/three-stdlib/')) {
              return 'r3f-vendor';
            }
            if (normalized.includes('node_modules/framer-motion/') || normalized.includes('node_modules/gsap/')) {
              return 'motion-vendor';
            }
            if (normalized.includes('node_modules/howler/')) {
              return 'audio-vendor';
            }
            if (normalized.includes('node_modules/lucide-react/')) {
              return 'icons-vendor';
            }
          }
        },
      },
    },
  },
})

