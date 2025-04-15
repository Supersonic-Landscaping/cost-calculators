import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public',
    rollupOptions: {
      input: {
        hedge: './hedge/script.js',
        mowing: './mowing/script.js',
        mulching: './mulching/script.js'
      },
      output: {
        entryFileNames: '[name]/[name]-calculator.js'
      }
    }
  }
});

