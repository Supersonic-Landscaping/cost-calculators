import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      // This option tells Rollup to inline all dynamic imports into a single bundle.
      inlineDynamicImports: true,
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


