import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public',
    rollupOptions: {
      input: {
        hedge: './hedge/script.js',
        lawn: './lawn/script.js',
        mulch: './mulch/script.js'
      },
      output: {
        // This renames your output files.
        // For example, the `hedge` entry will output to `public/hedge/hedge-calculator.js`
        // even though the source was named "script.js".
        entryFileNames: '[name]/[name]-calculator.js'
      }
    }
  }
});
