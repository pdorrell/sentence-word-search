import { defineConfig } from 'vite';
import { geaPlugin } from '@geajs/vite-plugin';
import { hostname } from 'os';

export default defineConfig({
  plugins: [geaPlugin()],
  server: {
    host: `${hostname()}.local`,
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});