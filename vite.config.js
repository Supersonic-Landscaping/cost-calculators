import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Remember: use a separate directory so /public isn't overwritten
    rollupOptions: {
      inlineDynamicImports: true, // <-- This tells Rollup to bundle everything in one file
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

