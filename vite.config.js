import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        results: resolve(__dirname, 'results.html'),
        guide: resolve(__dirname, 'guide.html')
      }
    }
  },
  plugins: [
    {
      name: 'copy-json',
      closeBundle() {
        copyFileSync('rhetoric-devices.json', 'dist/rhetoric-devices.json');
      }
    }
  ]
});
