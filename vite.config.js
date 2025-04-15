import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public',  // The directory Cloudflare Pages will serve from
    rollupOptions: {
      input: {
        hedge: './hedge/script.js',
        mowing: './mowing/script.js',
        mulching: './mulching/script.js'
      },
      output: {
        // This renames your bundled files inside subfolders in public:
        // e.g., public/hedge/hedge-calculator.js, public/mowing/mowing-calculator.js, etc.
        entryFileNames: '[name]/[name]-calculator.js'
      }
    }
  }
});
