import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Admin panel Vite server — separate from the public site (5173). */
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_MODE': JSON.stringify('admin'),
  },
  server: {
    port: 5180,
    strictPort: true,
    open: '/admin/login',
    proxy: {
      '/api': {
        target: 'http://localhost:3076',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3076',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5180,
    strictPort: true,
  },
  build: {
    outDir: 'dist-admin',
  },
});
