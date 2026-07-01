import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production-optimized Vite configuration
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Enable esbuild minification
    minify: 'esbuild',
    // Tree shaking
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-pdf': ['html2canvas', 'dompurify', 'jspdf'],
        },
      },
    },
    // Increase chunk warning limit for PDF libraries
    chunkSizeWarningLimit: 700,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Source maps for production debugging (disable for smaller bundles)
    sourcemap: false,
  },
  // Performance optimizations
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    port: 4000,
  },
});
