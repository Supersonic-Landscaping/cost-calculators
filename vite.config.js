import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Use a separate folder for built files
    rollupOptions: {
      input: {
        hedge: './hedge/script.js',
        mowing: './mowing/script.js',
        mulching: './mulching/script.js'
      },
      output: {
        // Bundled files will appear in subfolders in /dist
        entryFileNames: '[name]/[name]-calculator.js'
      }
    }
  }
});

