import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { hostname } from 'os';

export default defineConfig({
  plugins: [react()],
  server: {
    host: `${hostname()}.local`,
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});